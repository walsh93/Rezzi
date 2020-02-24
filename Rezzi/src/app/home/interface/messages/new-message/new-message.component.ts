import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Message, User } from '../../../../classes.model';
import { MessagesService } from '../messages.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  tempuser = new User('a@a.com', 'abc123', 'Conley', 'Utz', 21, 'CS', 'Con', 'Hi I\'m Conley', true);
  enteredMessage = '';

  constructor(public messagesService: MessagesService) { }

  onAddMessage(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const message: Message = {
      content: form.value.enteredMessage,
      // owner: this.tempuser,
      // time: new Date(),
      // visible: true,
      id: null // TODO Need to change the ID
    };
    this.messagesService.addMessage(message);
    form.resetForm();
  }

  ngOnInit() {
  }

}
