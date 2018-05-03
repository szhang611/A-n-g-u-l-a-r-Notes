import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Bcrypt1Component } from './bcrypt-1.component';

describe('Bcrypt1Component', () => {
  let component: Bcrypt1Component;
  let fixture: ComponentFixture<Bcrypt1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bcrypt1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bcrypt1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
