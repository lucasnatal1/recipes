import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
})
export class ConfirmModalComponent implements OnInit {
  message: string;
  title: string;
  @Output() responseEvent = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}

  onClick(response: boolean) {
    this.responseEvent.emit(response);
  }
}
