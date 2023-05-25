import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
})
export class CustomAlertComponent implements OnInit {
  @Input() alertMessage: string;
  @Input() success: boolean;
  @Output() timeOutEvent = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.onTimeOut();
    }, 2000);
  }

  onTimeOut() {
    this.timeOutEvent.emit();
  }
}
