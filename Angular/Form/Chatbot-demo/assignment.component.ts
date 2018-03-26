// import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
// import {FormControl, FormGroup} from "@angular/forms";
// import {PolicyService} from "../../../_services/policy.service";
// import {AlertService} from "../../../_services/alert.service";
// import {LoadingService} from "../../../modal/loading/loading.service";

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit,AfterViewInit {

  userForm: any;
  agencyList: Array<string>;
  agencyPeopleList: Array<string>;
  formControl_1;formControl_2;formControl_3;formControl_4;
  selectedAgency;
  mask: boolean = false;
  currentAgency = "";

  @ViewChild("agencySelect") agencySelect;
  @ViewChild("form_1") form_1;
  @ViewChild("form_2") form_2;
  @ViewChild("form_3") form_3;
  @ViewChild("form_4") form_4;
  constructor( private policyService: PolicyService,
               private alertService: AlertService,
               private loadingService: LoadingService) { }

  ngOnInit() {
    this.initData();
    this.mask = false;
  }

  ngAfterViewInit() {
    this.userForm.get('formControl_1').valueChanges.subscribe(
      data => {
        this.formControl_1 = data;
      }
    );
    this.userForm.get('formControl_2').valueChanges.subscribe(
      data => {
        this.formControl_2 = data;
      }
    );
    this.userForm.get('formControl_3').valueChanges.subscribe(
      data => {
        this.formControl_3 = data;
      }
    );
    this.userForm.get('formControl_4').valueChanges.subscribe(
      data => {
        this.formControl_4 = data;
      }
    );
  }

  initData() {
    this.userForm = new FormGroup({
      formControl_1: new FormControl(),
      formControl_2: new FormControl(),
      formControl_3: new FormControl(),
      formControl_4: new FormControl(),
    });

    this.getAgencies();
  }

  accessControl () {
    if(localStorage.getItem("IsAdmin") != "1") {
      this.agencySelect.nativeElement.disabled = true;
      let _find = (elm)=>{return elm["agencyID"] === localStorage.getItem("AgencyId")};
      let idx = this.agencyList.findIndex(_find);
      this.agencySelect.nativeElement.selectedIndex = idx;
      this.currentAgency = this.agencyList[idx]["agencyName"];

      this.getAgencyService(localStorage.getItem("AgencyId"));
    }
  }

  getAgencies () {
    this.show_loading();
    this.policyService.getAgencies().subscribe(data => {
      // console.log(data);
      this.agencyList = data;

      this.accessControl();

      this.hide_loading();
    },
      err => {
        console.error(err);
        this.hide_loading();
        this.alertService.openAlertDialog("获取店铺列表失败！");
        },
      ()=>{});
  }

  getAgencyService (agencyID) {
    this.show_loading();
    this.policyService.getAgencyService(agencyID).subscribe(data=>{
      // console.log(data);
      this.agencyPeopleList = data;
        this.hide_loading();
    },err=>{console.error(err);
        this.hide_loading();
        this.alertService.openAlertDialog("获取本店员工列表失败！");},
      ()=>{});
  }

  selectAgency (e) {
    this.selectedAgency = this.agencyList[e.target.selectedIndex];
    this.getAgencyService(this.agencyList[e.target.selectedIndex]["agencyID"]);
  }

  saveAssociate () {
    if(!this.formControl_2 || !this.formControl_3 || !this.formControl_4) {
      let msg = `未选项将默认设置为销售`;
      this.alertService.openAlertDialog(msg);
    }

    let agency_id = "";
    if(localStorage.getItem("IsAdmin") != "1"){
      agency_id = localStorage.getItem("AgencyId");
    } else {
      agency_id = this.selectedAgency["agencyID"];
    }

    let Associate_obj = {
      AssociateID : "",
      AgencyID : agency_id,
      SalesID : this.formControl_1.agencyServiceID,
      SecondHandID : (this.formControl_2)?this.formControl_2.agencyServiceID:this.formControl_1.agencyServiceID,
      AfterSalesID : (this.formControl_3)?this.formControl_3.agencyServiceID:this.formControl_1.agencyServiceID,
      RescueID : (this.formControl_4)?this.formControl_4.agencyServiceID:this.formControl_1.agencyServiceID,
      UpdateBy : localStorage.getItem("currentUser")
    };
    this.saveAssociate_method(Associate_obj);
  }

  saveAssociate_method (Associate_obj) {
    this.show_loading();
    this.policyService.saveAssociate(Associate_obj).subscribe(
      () => {
        let _find = (elm)=>{return elm["agencyServiceID"] === this.formControl_1.agencyServiceID};
        if(!this.formControl_2) {
          this.userForm.get("formControl_2").setValue(this.agencyPeopleList.find(_find));
          this.form_2.nativeElement.selectedIndex = this.agencyPeopleList.findIndex(_find);
        }
        if(!this.formControl_3) {
          this.userForm.get("formControl_3").setValue(this.agencyPeopleList.find(_find));
          this.form_3.nativeElement.selectedIndex = this.agencyPeopleList.findIndex(_find);
        }
        if(!this.formControl_4) {
          this.userForm.get("formControl_4").setValue(this.agencyPeopleList.find(_find));
          this.form_4.nativeElement.selectedIndex = this.agencyPeopleList.findIndex(_find);
        }

        this.hide_loading();
        this.alertService.openAlertDialog("保存成功！");
      },
      err=>{console.error(err);
        this.hide_loading();
        this.alertService.openAlertDialog("保存失败！");},
      ()=>{}
    );
  }

  getAssociateChange(e) {
    let SalesID = this.agencyPeopleList[e.target.selectedIndex]["agencyServiceID"];
    this.getAssociate(SalesID);
  }

  getAssociate (SalesID) {
    this.show_loading();
    this.policyService.getAssociate(SalesID).subscribe(data => {
      if(data) {
        let _find_SecondHandID = (elm)=>{return elm["agencyServiceID"] === data.SecondHandID};
        let _find_AfterSalesID = (elm)=>{return elm["agencyServiceID"] === data.AfterSalesID};
        let _find_RescueID = (elm)=>{return elm["agencyServiceID"] === data.RescueID};

        this.userForm.get("formControl_2").setValue(this.agencyPeopleList.find(_find_SecondHandID));
        this.form_2.nativeElement.selectedIndex = this.agencyPeopleList.findIndex(_find_SecondHandID);
        this.userForm.get("formControl_3").setValue(this.agencyPeopleList.find(_find_AfterSalesID));
        this.form_3.nativeElement.selectedIndex = this.agencyPeopleList.findIndex(_find_AfterSalesID);
        this.userForm.get("formControl_4").setValue(this.agencyPeopleList.find(_find_RescueID));
        this.form_4.nativeElement.selectedIndex = this.agencyPeopleList.findIndex(_find_RescueID);
      } else {
        this.userForm.get("formControl_2").setValue(null);
        this.form_2.nativeElement.selectedIndex = this.agencyPeopleList.length;
        this.userForm.get("formControl_3").setValue(null);
        this.form_3.nativeElement.selectedIndex = this.agencyPeopleList.length;
        this.userForm.get("formControl_4").setValue(null);
        this.form_4.nativeElement.selectedIndex = this.agencyPeopleList.length;
      }
      this.hide_loading();
    },err => {
      console.error(err);
      this.hide_loading();
      this.alertService.openAlertDialog("获取信息失败！");
    },()=>{});
  }


  show_loading () {
    this.loadingService.show();
    this.mask = true;
  }
  hide_loading () {
    this.loadingService.hide();
    this.mask = false;
  }



}
