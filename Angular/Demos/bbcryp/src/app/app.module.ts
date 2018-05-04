import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { B1Component } from './AES/b1.component';
import { Sha256Component } from './sha256/sha256.component';


@NgModule({
  declarations: [
    AppComponent,
    B1Component,
    Sha256Component
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
