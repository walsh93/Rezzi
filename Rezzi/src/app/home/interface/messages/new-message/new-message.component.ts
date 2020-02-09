import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  message = '';
  @Output() messageCreated = new EventEmitter();

  onAddMessage() {
    this.messageCreated.emit(this.message);
  }

  constructor() { }

  ngOnInit() {
  }

}
