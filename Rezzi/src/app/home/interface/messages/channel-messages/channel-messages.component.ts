import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable, range } from 'rxjs';

import { Message, AbbreviatedUser } from '../../../../classes.model';
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
  private channelsAlreadyViewed: string[] = [];

  isHidden = false;  // By default, want to show channel messages and new-message component
  private isHiddenSubsc: Subscription;
  @Input() isHiddenObs: Observable<boolean>;

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

  // This user's ability to post in channels from interface.component
  private canPost = true;
  private canPostUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('canPostUpdateEvent') canPostObs: Observable<boolean>;
  private isMutedUpdateSub: Subscription;
  @Input() isMutedObs: Observable<boolean>;

  constructor(public messagesService: MessagesService) {
    this.session = null;
    this.currentChannel = null;
    this.channels = [];
    this.channelMap = new Map<string, ChannelData>();
  }

  ngOnInit() {
    // Listen for whether or not to view this in the interface or some other component
    this.isHiddenSubsc = this.isHiddenObs.subscribe((viewNow) => {
      this.isHidden = !viewNow;
    });

    // Listen for user updates
    this.userUpdateSub = this.userObs.subscribe((updatedUser) => {
      this.user = updatedUser;
    });

    // Listen for session updates
    this.sessionUpdateSub = this.sessionObs.subscribe((updatedSession) => {
      this.session = updatedSession;
    });

    // Listen for channel list updates
    this.channelUpdateSub = this.channelsObs.subscribe((updatedChannels) => {
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
        /**
         * emitNewChannelView() emits a message to the server to add a new channel document listener
         * When that listener is registered, if it is a channel that has not yet been viewed, added-new-message
         * event is emitted on the first read of the document. This in turn triggers the message.service
         * messageUpdate subject.
         * If the channel has been viewed before, it skips this registration and does not emit a added-new-mesage
         * event. Thus the he message.service messageUpdate subject is not triggered, and you need to get the
         * channel messages manually.
         */
        this.messagesService.emitNewChannelView(dbpath);  // eventually triggers addListenerForChannelMessages
        if (this.channelsAlreadyViewed.includes(updatedChannelID)) {
          this.messagesService.getChannelMessages(dbpath.channelPath, dbpath.channelName);  // Triggers msg upd listener
        } else {
          this.channelsAlreadyViewed.push(updatedChannelID);
        }
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
      const diffNumberOfMessages = (this.messages.length !== updatedMessages.length);
      this.needToUpdateScroll = (this.amViewingNewChannel || diffNumberOfMessages);  // Don't scroll on reaction only
      if (this.needToUpdateScroll) {
        this.messages = updatedMessages;
      } else {
        this.replaceReactedMessage(updatedMessages);
      }
      this.amViewingNewChannel = false;  // Need to reset once on channel
    }); // First function, Second error, Third when observable completed
  }

  /**
   * Iterate through updated messages, find which one was reacted to, and replace it in the messages array
   * @param updatedMessages - array of updated messages
   */
  private replaceReactedMessage(updatedMessages: Message[]) {
    for (let i = 0; i < updatedMessages.length; i++) {
      // Skip if it's a BOT message because they don't have reaction data
      const origMsg = this.messages[i];
      if (origMsg.id === 'BOT_MSG') {
        continue;
      }

      // Check length of each reaction array
      const origMsgReacData = origMsg.reactions;
      const newMsgReacData = updatedMessages[i].reactions;
      if (origMsgReacData.sentiment_dissatisfied.length !== newMsgReacData.sentiment_dissatisfied.length ||
            origMsgReacData.sentiment_very_satisfied.length !== newMsgReacData.sentiment_very_satisfied.length ||
            origMsgReacData.thumb_down.length !== newMsgReacData.thumb_down.length ||
            origMsgReacData.thumb_up.length !== newMsgReacData.thumb_up.length ||
            origMsgReacData.whatshot.length !== newMsgReacData.whatshot.length) {
        this.messages[i] = updatedMessages[i];
        break;
      }
    }
  }

  ngOnDestroy() {
    this.isHiddenSubsc.unsubscribe();
    this.userUpdateSub.unsubscribe();
    this.sessionUpdateSub.unsubscribe();
    this.channelUpdateSub.unsubscribe();
    this.messagesSub.unsubscribe(); // useful when changing channels
    this.viewingUpdateSub.unsubscribe();
    this.canPostUpdateSub.unsubscribe();
    this.isMutedUpdateSub.unsubscribe();
  }

}
