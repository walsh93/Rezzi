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
  private channelMap: Map<string, ChannelData>;


  // Session data retrieved from interface.component
  session: any;
  private sessionUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('sessionUpdateEvent') sessionObs: Observable<any>;


  // Channel list retrieved from interface.component
  channels: ChannelData[];
  private channelUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('channelsUpdateEvent') channelsObs: Observable<ChannelData[]>;


  // Current channel retrieved from interface.component
  currentChannel: string;
  private viewingUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('viewingUpdateEvent') viewingObs: Observable<string>;


  constructor(public messagesService: MessagesService) {
    this.session = null;
    this.currentChannel = null;
    this.channels = [];
    this.channelMap = new Map<string, ChannelData>();
  }

  ngOnInit() {
    // Listen for session updates
    this.sessionUpdateSub = this.sessionObs.subscribe((updatedSession) => {
      console.log('session has been updated in channel-messages.component');
      this.session = updatedSession;
    });

    // Listen for channel list updates
    this.channelUpdateSub = this.channelsObs.subscribe((updatedChannels) => {
      console.log('channels have been updated');
      this.channels = updatedChannels;

      updatedChannels.forEach((channel) => {
        this.channelMap.set(channel.id, channel);
      });
    });

    // Listen for changes in which channel is being viewed TODO @Kai get messages in here!
    this.viewingUpdateSub = this.viewingObs.subscribe((updatedChannelID) => {
      this.currentChannel = updatedChannelID;
      const dbpath = this.messagesService.createChannelPath(this.session.rezzi, updatedChannelID);
      if (dbpath != null && dbpath !== undefined) {
        this.messagesService.getChannelMessages(dbpath.channelPath, dbpath.channelName);  // Triggers msg upd listener
        this.messagesService.emitNewChannelView(dbpath);  // eventually triggers addListenerForChannelMessages
      }
    });

    // TODO What is the opening channel view? Do we need to call this.messagesService.emitNewChannelView on opening?

    // Listen for updated message list
    this.messagesSub = this.messagesService.getMessageUpdateListener().subscribe((updatedMessages: Message[]) => {
      console.log('Messages are updating...');
      this.messages = updatedMessages;
    }); // First function, Second error, Third when observable completed
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
    this.channelUpdateSub.unsubscribe();
    this.messagesSub.unsubscribe(); // useful when changing channels
    this.viewingUpdateSub.unsubscribe();
  }
}
