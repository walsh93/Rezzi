import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable, range } from 'rxjs';

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
  currentChannel: string;
  channels: ChannelData[];
  private channelUpdateSub: Subscription;
  private sessionUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('sessionUpdateEvent') sessionObs: Observable<ChannelData[]>;
  // tslint:disable-next-line: no-input-rename
  @Input('channelsUpdateEvent') channelsObs: Observable<ChannelData[]>;
  private channelMap: Map<string, ChannelData>;

  constructor(public messagesService: MessagesService) {
    this.session = null;
    this.currentChannel = null;
    this.channels = [];
    this.channelMap = new Map<string, ChannelData>();
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

      updatedChannels.forEach((channel) => {
        this.channelMap.set(channel.id, channel);
      });
      console.log(this.channelMap);
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
