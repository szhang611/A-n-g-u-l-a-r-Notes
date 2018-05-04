import { Component, OnInit } from '@angular/core';

import * as cryptoJS from 'crypto-js';
// const cryptoJS = require('crypto-js');
// const SHA256 = require('crypto-js/sha256');
// const AES = require('crypto-js/aes');


@Component({
  selector: 'app-sha256',
  templateUrl: './sha256.component.html',
  styleUrls: ['./sha256.component.css']
})
export class Sha256Component implements OnInit {

  constructor() { }

  ngOnInit() {
    this.init();
  }

  init () {
    const name = 'sam_zhang';
    console.log(`encrypted name is : : : ${SHA256_encrypt(name)}`);

  }

}


function SHA256_encrypt (param) {
  return cryptoJS.SHA256(param);
}
