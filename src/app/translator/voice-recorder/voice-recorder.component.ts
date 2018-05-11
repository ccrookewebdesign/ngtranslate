import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { interval } from 'rxjs/observable/interval';
import { timer } from 'rxjs/observable/timer';
import { fromEvent } from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/timeout';

import { RecognitionService } from './recognition.service';

@Component({
  selector: 'voice-recorder',
  styleUrls: ['./voice-recorder.component.css'],
  template: `
    <i (click)="handleToggle()" class="fa fa-microphone fa-1x" [class.isrecording]="isRecording"></i>
    <!--
    <p><strong>Recognized:</strong> {{ onSpeechFound | async }}</p>
    <p><strong>For translation</strong> {{textToTranslate}}</p>
    -->
  `,
  providers: [RecognitionService]
})
export class VoiceRecorderComponent implements OnInit, OnDestroy {
  @Input() textToTranslate: string;
  @Output() onSpeechFound = new EventEmitter<string>();

  subscriptions: Subscription[] = [];
  recognition: SpeechRecognition;
  isAutoRestarting: boolean = false;
  isRecording: boolean = false;

  constructor(private RecognitionService: RecognitionService) {}

  ngOnInit() {
    this.recognition = this.RecognitionService.getRecognition();
    const result$ = fromEvent(this.recognition, 'result');
    const start$ = fromEvent(this.recognition, 'start');
    const stop$ = fromEvent(this.recognition, 'stop');
    const end$ = fromEvent(this.recognition, 'end');

    const onStart = start$.subscribe(() => {
      this.isRecording = true;

      if (this.textToTranslate.length) {
        this.textToTranslate += ' ';
      }

      result$.timeout(7000).subscribe(null, () => {
        if (this.isRecording) {
          this.isAutoRestarting = true;
          this.recognition.stop();
          this.isRecording = false;
        }
      });
    });

    const onEnd = stop$.subscribe(() => {
      if (this.isAutoRestarting) {
        this.isAutoRestarting = false;
        this.recognition.start();
      } else {
        this.isRecording = false;
      }
    });

    const onResult = result$
      .map((e: SpeechRecognitionEvent) => e.results[e.results.length - 1])
      .filter((result: SpeechRecognitionResult) => result.isFinal)
      .map((result: SpeechRecognitionResult) => result[0].transcript)
      .distinct()
      .subscribe((text: string) => {
        this.textToTranslate += text;
        this.onSpeechFound.emit(this.textToTranslate);
      });

    this.subscriptions = this.subscriptions.concat([onStart, onEnd, onResult]);
  }

  ngOnDestroy() {
    this.recognition.stop();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  handleToggle() {
    if (!this.isRecording) {
      this.recognition.start();
    } else {
      this.recognition.stop();
    }
    this.isRecording = !this.isRecording;
  }
}
