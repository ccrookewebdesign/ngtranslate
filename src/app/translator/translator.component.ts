import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GoogleService, GoogleObj } from './google.services';

import { environment } from '../../environments/environment';

@Component({
  selector: 'translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css'],
  providers: [GoogleService]
})
export class TranslatorComponent implements OnInit {
  textToTranslate: string = '';
  textToDisplay: string = '';
  translatedText = '';
  btnSubmit: any;
  googleObj: GoogleObj = new GoogleObj();
  key: string = environment.apiKey;

  constructor(private googleService: GoogleService) {}

  ngOnInit() {
    this.btnSubmit = document.getElementById('btnSubmit');
  }

  updateText(newText) {
    this.btnSubmit.disabled = false;
    this.textToTranslate = newText;
    this.textToDisplay = newText;
  }

  onClear() {
    this.googleObj.q = '';
    this.textToTranslate = '';
  }

  handleSpeechFound(text: string) {
    this.textToTranslate = text;
    this.textToDisplay = text;
    this.send();
  }

  send() {
    this.btnSubmit.disabled = true;
    this.googleObj.q = this.textToTranslate;

    this.googleService.translate(this.googleObj, this.key).subscribe(
      (res: any) => {
        this.translatedText = res.data.translations[0].translatedText;
      },
      err => {
        console.log(err);
      }
    );
  }

  isMobileDevice() {
    return (
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1
    );
  }
}
