import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sha256Component } from './sha256.component';

describe('Sha256Component', () => {
  let component: Sha256Component;
  let fixture: ComponentFixture<Sha256Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sha256Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sha256Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
