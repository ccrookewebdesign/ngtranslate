import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TranslatorComponent } from './translator/translator.component';
import { VoiceRecorderComponent } from './translator/voice-recorder/voice-recorder.component';

@NgModule({
  declarations: [AppComponent, TranslatorComponent, VoiceRecorderComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
