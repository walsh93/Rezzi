import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { Message, NodeSession, AbbreviatedUserProfile } from '../../../../classes.model';
import { MessagesService } from '../messages.service';
import { ChannelData } from '../../../../classes.model';
import { InterfaceService } from '../../interface.service';

@Component({
  selector: 'app-channel-messages',
  templateUrl: './channel-messages.component.html',
  styleUrls: ['./channel-messages.component.css']
})
export class ChannelMessagesComponent implements OnInit, OnDestroy {
  // Node session data
  nodeSession: NodeSession;
  private nodeSessionSubsc: Subscription;

  // User profile data
  userProfileAbr: AbbreviatedUserProfile;
  private userProfileAbrSubsc: Subscription;
  private canPost: boolean;
  private canPostSubsc: Subscription;

  // Channel data
  private myChannels: ChannelData[];
  private myChannelsSubsc: Subscription;
  private isMutedSubsc: Subscription;

  // Viewing data
  currentChannelID: string;
  private newChannelViewSubsc: Subscription;




  messages: Message[] = [];
  private messagesSub: Subscription;

  isHidden = false;  // By default, want to show channel messages and new-message component
  private isHiddenSubsc: Subscription;
  @Input() isHiddenObs: Observable<boolean>;

  amViewingNewChannel = false;
  needToUpdateScroll = false;

  constructor(private interfaceService: InterfaceService, public messagesService: MessagesService) { }

  ngOnInit() {
    this.initializeNodeSession();
    this.initializeAbbreviatedUserProfile();
    this.initializeCanPost();
    this.initializeChannelData();
    this.initializeChannelViewListener();

    // Listen for whether or not to view this in the interface or some other component
    this.isHiddenSubsc = this.isHiddenObs.subscribe((viewNow) => {
      this.isHidden = !viewNow;
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

  private initializeNodeSession() {
    this.nodeSession = this.interfaceService.getNodeSession();
    this.nodeSessionSubsc = this.interfaceService.getNodeSessionListener().subscribe(session => {
      this.nodeSession = session;
    });
  }

  private initializeAbbreviatedUserProfile() {
    this.userProfileAbr = this.interfaceService.getAbbreviatedUserProfile();
    this.userProfileAbrSubsc = this.interfaceService.getAbbreviatedUserProfileListener().subscribe(userAbr => {
      this.userProfileAbr = userAbr;
    });
  }

  private initializeCanPost() {
    this.canPost = this.interfaceService.getCanPost();
    if (this.canPost != null) {
      this.updateComponentHeight(this.canPost);
    }
    this.canPostSubsc = this.interfaceService.getCanPostListener().subscribe(canPostNow => {
      this.canPost = canPostNow;
      this.updateComponentHeight(this.canPost);
    });
  }

  private initializeChannelData() {
    this.myChannels = this.interfaceService.getMyChannels();
    this.myChannelsSubsc = this.interfaceService.getMyChannelsListener().subscribe(myChannels => {
      this.myChannels = myChannels;
    });
    if (this.canPost) {
      this.isMutedSubsc = this.interfaceService.getIsMutedListener().subscribe(isMutedNow => {
        this.updateComponentHeight(isMutedNow);
      });
    }
  }

  private initializeChannelViewListener() {
    // Listen for changes in which channel is being viewed TODO @Kai get messages in here!
    this.newChannelViewSubsc = this.interfaceService.getNewChannelViewListener().subscribe(newChannelViewID => {
      this.currentChannelID = newChannelViewID;
      const dbpath = this.messagesService.createChannelPath(this.nodeSession.rezzi, newChannelViewID);
      if (dbpath != null && dbpath !== undefined) {
        this.amViewingNewChannel = true;
        this.messagesService.getChannelMessages(dbpath.channelPath, dbpath.channelName);  // Triggers msg upd listener
        this.messagesService.emitNewChannelView(dbpath);  // eventually triggers addListenerForChannelMessages
      }
    });
  }

  /**
   * Header navbar height = 64px (mat-tool-bar default)
   * Channel navbar height = 64px (mat-tool-bar default)
   * app-new-message height = 90px (declared in new-message.component.css)
   */
  private updateComponentHeight(newMsgBarIsVisible: boolean) {
    if (newMsgBarIsVisible) {
      document.getElementById('channelMessages').style.height = 'calc(100vh - 218px)';
    } else {
      document.getElementById('channelMessages').style.height = 'calc(100vh - 128px)';
    }
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

  ngOnDestroy() {
    this.nodeSessionSubsc.unsubscribe();
    this.userProfileAbrSubsc.unsubscribe();
    this.canPostSubsc.unsubscribe();
    this.myChannelsSubsc.unsubscribe();
    if (this.isMutedSubsc != null) {
      this.isMutedSubsc.unsubscribe();
    }
    this.newChannelViewSubsc.unsubscribe();


    this.isHiddenSubsc.unsubscribe();
    this.messagesSub.unsubscribe(); // useful when changing channels
  }

}
