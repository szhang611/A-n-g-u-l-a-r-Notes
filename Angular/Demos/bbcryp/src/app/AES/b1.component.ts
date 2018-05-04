import { Component, OnInit } from '@angular/core';
import * as cryptoJS from 'crypto-js';
// const cryptoJS = require('crypto-js');
// const SHA256 = require('crypto-js/sha256');
// const AES = require('crypto-js/aes');

@Component({
  selector: 'app-b1',
  templateUrl: './b1.component.html',
  styleUrls: ['./b1.component.css']
})
export class B1Component implements OnInit {

  private static NAME = 'name here';
  constructor() {}

  AES_encrypt: any;
  AES_decrypt: any;

  ngOnInit() {
    // console.log(cryptoJS);
    // console.log(password_SHA256(B1Component.NAME));
    // console.log(password_AES(B1Component.NAME));


    // AES encrypt with a salt key, and use Localstorage to store this value.
    // AES decrypt also need the key used when encrypted.
    const str = 'sam_zhang';
    console.log(password_AES_encrypt(str));
    localStorage.setItem('storeAES',password_AES_encrypt(str));
    this.AES_encrypt = password_AES_encrypt(str).toString();

    const temp = localStorage.getItem('storeAES');
    console.log(`temp : ${temp}`);

    console.log(`decrypt password : : :  ${password_AES_decrypt(temp)}`);
    this.AES_decrypt = password_AES_decrypt(temp);
  }

}


function password_SHA256 (param) {
  return cryptoJS.SHA256(param);
}
function password_AES_encrypt (param) {
  // return AES.encrypt(param,'salt');
  return cryptoJS.AES.encrypt(param,'name');
}
function password_AES_decrypt (param) {
  return cryptoJS.AES.decrypt(param,'name').toString(cryptoJS.enc.Utf8);
}



