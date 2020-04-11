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

  // Channel data
  private myChannels: ChannelData[];
  private myChannelsSubscr: Subscription;




  messages: Message[] = [];
  private messagesSub: Subscription;
  private channelMap: Map<string, ChannelData>;

  isHidden = false;  // By default, want to show channel messages and new-message component
  private isHiddenSubsc: Subscription;
  @Input() isHiddenObs: Observable<boolean>;

  amViewingNewChannel = false;
  needToUpdateScroll = false;

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

  // This user's ability to post in channels from interface.component
  private canPost = true;
  private canPostUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('canPostUpdateEvent') canPostObs: Observable<boolean>;
  private isMutedUpdateSub: Subscription;
  @Input() isMutedObs: Observable<boolean>;

  constructor(private interfaceService: InterfaceService, public messagesService: MessagesService) {
    this.currentChannel = null;
    this.channels = [];
    this.channelMap = new Map<string, ChannelData>();
  }

  ngOnInit() {
    // If testing messages/message view with `ng serve`
    // this.initializeTestData();

    this.initializeNodeSession();
    this.initializeAbbreviatedUserProfile();
    this.initializeMyChannels();

    // Listen for whether or not to view this in the interface or some other component
    this.isHiddenSubsc = this.isHiddenObs.subscribe((viewNow) => {
      this.isHidden = !viewNow;
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
      const dbpath = this.messagesService.createChannelPath(this.nodeSession.rezzi, updatedChannelID);
      if (dbpath != null && dbpath !== undefined) {
        this.amViewingNewChannel = true;
        this.messagesService.getChannelMessages(dbpath.channelPath, dbpath.channelName);  // Triggers msg upd listener
        this.messagesService.emitNewChannelView(dbpath);  // eventually triggers addListenerForChannelMessages
      }
    });

    // Listen for changes in user's 'canPost' tag and change the channel messages height accordingly
    /**
     * Header navbar height = 64px (mat-tool-bar default)
     * Channel navbar height = 64px (mat-tool-bar default)
     * app-new-message height = 90px (declared in new-message.component.css)
     */
    this.canPostUpdateSub = this.canPostObs.subscribe((canPost) => {
      this.canPost = canPost;
    });

    this.isMutedUpdateSub = this.isMutedObs.subscribe((isMuted) => {
      if (this.canPost) {
        if (isMuted) {
          document.getElementById('channelMessages').style.height = 'calc(100vh - 128px)';  // account for removed msg bar
        } else {
          document.getElementById('channelMessages').style.height = 'calc(100vh - 218px)';  // account for msg bar
        }
      } else {
        document.getElementById('channelMessages').style.height = 'calc(100vh - 128px)';  // account for removed msg bar
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

  private initializeNodeSession() {
    const session1 = this.interfaceService.getNodeSession();
    if (session1 == null) {
      this.nodeSessionSubsc = this.interfaceService.getNodeSessionListener().subscribe(session2 => {
        this.nodeSession = session2;
      });
    } else {
      this.nodeSession = session1;
    }
  }

  private initializeAbbreviatedUserProfile() {
    const userAbr1 = this.interfaceService.getAbbreviatedUserProfile();
    if (userAbr1 == null) {
      this.userProfileAbrSubsc = this.interfaceService.getAbbreviatedUserProfileListener().subscribe(userAbr2 => {
        this.userProfileAbr = userAbr2;
      });
    } else {
      this.userProfileAbr = userAbr1;
    }
  }

  private initializeMyChannels() {
    const myChannels1 = this.interfaceService.getMyChannels();
    if (myChannels1 == null) {
      this.myChannelsSubscr = this.interfaceService.getMyChannelsListener().subscribe(myChannels2 => {
        this.myChannels = myChannels2;
      });
    } else {
      this.myChannels = myChannels1;
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
    if (this.nodeSessionSubsc != null) {
      this.nodeSessionSubsc.unsubscribe();
    }
    if (this.userProfileAbrSubsc != null) {
      this.userProfileAbrSubsc.unsubscribe();
    }
    if (this.myChannelsSubscr != null) {
      this.myChannelsSubscr.unsubscribe();
    }
    this.isHiddenSubsc.unsubscribe();
    this.channelUpdateSub.unsubscribe();
    this.messagesSub.unsubscribe(); // useful when changing channels
    this.viewingUpdateSub.unsubscribe();
    this.canPostUpdateSub.unsubscribe();
    this.isMutedUpdateSub.unsubscribe();
  }

}
