import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Message, User } from '../../../../classes.model';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  tempuser = new User('a@a.com', 'abc123', 'Conley', 'Utz', 21, 'CS', 'Con', 'Hi I\'m Conley', true);
  enteredMessage = '';
  @Output() messageCreated = new EventEmitter<Message>();

  onAddMessage() {
    const message: Message = {
      content: this.enteredMessage,
      owner: this.tempuser,
      time: new Date(),
      visible: true
    }
    this.messageCreated.emit(message);
  }

  constructor() { }

  ngOnInit() {
  }

}
