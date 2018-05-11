import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const url = 'https://translation.googleapis.com/language/translate/v2?key=';

@Injectable()
export class GoogleService {
  constructor(private http: HttpClient) {}

  translate(obj: GoogleObj, key: string) {
    return this.http.post(url + key, obj);
  }
}

export class GoogleObj {
  q: string;
  readonly source: string = 'en';
  readonly target: string = 'es';
  readonly format: string = 'text';
}
