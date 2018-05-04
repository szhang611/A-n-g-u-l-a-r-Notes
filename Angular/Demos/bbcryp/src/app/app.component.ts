import {Component, OnInit} from '@angular/core';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  // constructor(private cryptoJS: crypto) {
  // }

  ngOnInit () {
    // this.Init();
  }

  Init () {
    // debugger;
    // console.log(this.cryptoJS);

  }



}
