import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Message } from '../../../../classes.model';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-channel-messages',
  templateUrl: './channel-messages.component.html',
  styleUrls: ['./channel-messages.component.css']
})
export class ChannelMessagesComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  private messagesSub: Subscription;

  constructor(public messagesService: MessagesService) { }

  ngOnInit() {
    this.messages = this.messagesService.getMessages();
    this.messagesSub = this.messagesService.getMessageUpdateListener()
      .subscribe((messages: Message[]) => {
        this.messages = messages;
      }); // First function, Second error, Third when observable completed
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe(); // useful when changing channels
  }
}
