import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { Bcrypt1Component } from "./bcrypt-1/bcrypt-1.component";


const routes: Routes =[
  { path: 'bcrypt-1',   component: Bcrypt1Component },
  { path: '', redirectTo: 'bcrypt-1', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
