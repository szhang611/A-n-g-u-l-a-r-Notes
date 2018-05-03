import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from "./app.root.routing";
import { Bcrypt1Component } from './bcrypt-1/bcrypt-1.component';


@NgModule({
  declarations: [
    AppComponent,
    Bcrypt1Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
