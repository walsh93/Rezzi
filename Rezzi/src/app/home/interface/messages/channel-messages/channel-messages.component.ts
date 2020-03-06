import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { Message } from '../../../../classes.model';
import { MessagesService } from '../messages.service';
import { ChannelData } from '../../../../classes.model';

@Component({
  selector: 'app-channel-messages',
  templateUrl: './channel-messages.component.html',
  styleUrls: ['./channel-messages.component.css']
})
export class ChannelMessagesComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  private messagesSub: Subscription;

  // Gets info from interface.component
  session: any;
  channels: ChannelData[];
  private channelUpdateSub: Subscription;
  private sessionUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('sessionUpdateEvent') sessionObs: Observable<ChannelData[]>;
  // tslint:disable-next-line: no-input-rename
  @Input('channelsUpdateEvent') channelsObs: Observable<ChannelData[]>;

  constructor(public messagesService: MessagesService) {
    this.session = null;
    this.channels = [];
  }

  ngOnInit() {
    // Listen for session updates
    this.sessionUpdateSub = this.sessionObs.subscribe((updatedSession) => {
      console.log('session has been updated');
      this.session = updatedSession;
    });

    // Listen for channel list updates
    this.channelUpdateSub = this.channelsObs.subscribe((updatedChannels) => {
      console.log('channels have been updated');
      this.channels = updatedChannels;
    });

    this.messagesService.getMessages();
    this.messagesSub = this.messagesService.getMessageUpdateListener()
      .subscribe((messages: Message[]) => {
        this.messages = messages;
      }); // First function, Second error, Third when observable completed
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
    this.channelUpdateSub.unsubscribe();
    this.messagesSub.unsubscribe(); // useful when changing channels
  }
}
