import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable, range } from 'rxjs';

import { Message, AbbreviatedUser } from '../../../../classes.model';
import { MessagesService } from '../messages.service';
import { ChannelData } from '../../../../classes.model';
import { User } from '../../../../classes.model';

@Component({
  selector: 'app-channel-messages',
  templateUrl: './channel-messages.component.html',
  styleUrls: ['./channel-messages.component.css']
})
export class ChannelMessagesComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  private messagesSub: Subscription;
  private channelMap: Map<string, ChannelData>;

  amViewingNewChannel = false;
  needToUpdateScroll = false;

  // Abbreviated User data
  user: AbbreviatedUser;
  private userUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('abbrevUserUpdateEvent') userObs: Observable<AbbreviatedUser>;

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
    // If testing messages/message view with `ng serve`
    // this.initializeTestData();

    // Listen for user updates
    this.userUpdateSub = this.userObs.subscribe((updatedUser) => {
      console.log('user has been updated in new-message.component');
      this.user = updatedUser;
      console.log(this.user);
    });

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
        this.amViewingNewChannel = true;
        this.messagesService.getChannelMessages(dbpath.channelPath, dbpath.channelName);  // Triggers msg upd listener
        this.messagesService.emitNewChannelView(dbpath);  // eventually triggers addListenerForChannelMessages
      }
    });

    // TODO What is the opening channel view? Do we need to call this.messagesService.emitNewChannelView on opening?

    // Listen for updated message list
    this.messagesSub = this.messagesService.getMessageUpdateListener().subscribe((updatedMessages: Message[]) => {
      console.log('Messages are updating...');
      const diffNumberOfMessages = (this.messages.length !== updatedMessages.length);
      this.needToUpdateScroll = (this.amViewingNewChannel || diffNumberOfMessages);  // Don't scroll on reaction only
      this.messages = updatedMessages;
      this.amViewingNewChannel = false;  // Need to reset once on channel
    }); // First function, Second error, Third when observable completed
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
    this.channelUpdateSub.unsubscribe();
    this.messagesSub.unsubscribe(); // useful when changing channels
    this.viewingUpdateSub.unsubscribe();
  }

  /*initializeTestData() {
    const owner1 = new AbbreviatedUser('email1@purdue.edu', 'Lucky', 'McStruessel', 'Shrimpy');
    const owner2 = new AbbreviatedUser('email2@purdue.edu', 'Doc', 'Goodman', 'Sean the Sheep');
    const m1: Message = {
      owner: owner1,
      content: 'Testing 1-2-3',
      time: new Date('2020-01-26'),
      visible: true,
      reactions: {
        thumb_up: ["aa"],
        thumb_down: ["aa", "aaaa"],
        sentiment_very_satisfied: ["aaaa}", "aaaa"],
        sentiment_dissatisfied: [],
        whatshot: ["a", "b", "c", "d", "e"]
      }
      id: null
    };
    const m2: Message = {
      owner: owner2,
      content: 'you\'re on your own, kiddo',
      time: new Date('2020-02-14'),
      visible: true,
      reactions: {
        thumb_up: ["aa"],
        thumb_down: ["aa", "aaaa"],
        sentiment_very_satisfied: ["aaaa}", "aaaa"],
        sentiment_dissatisfied: [],
        whatshot: ["a", "b", "c", "d", "e"]
      }
    };
    const m3: Message = {
      owner: owner1,
      content: 'frickin rip',
      time: new Date('2020-03-05'),
      visible: true,
      reactions: {
        thumb_up: ["aa"],
        thumb_down: ["aa", "aaaa"],
        sentiment_very_satisfied: ["conleyutz@gmail.com", "aaaa"],
        sentiment_dissatisfied: [],
        whatshot: ["a", "b", "c", "d", "e"]
      }
    };
    this.messages.push(m1);
    this.messages.push(m2);
    this.messages.push(m3);
  }*/
}
