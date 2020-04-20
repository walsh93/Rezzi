import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Message, NodeSession, AbbreviatedUserProfile } from '../../../../classes.model';
import { MessagesService } from '../messages.service';
import { InterfaceService } from '../../interface.service';
import { ChannelNavBarService } from '../../channel-nav-bar/channel-nav-bar.service';
import * as c from '../../interface.constants';

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
  private isMuted: boolean;
  private isMutedSubsc: Subscription;

  // Viewing data
  isHidden = false;  // By default, want to show channel messages and new-message component
  private interfaceViewSubsc: Subscription;
  currentChannelID: string;
  private newChannelViewSubsc: Subscription;

  // Message data
  messages: Message[] = [];
  private messagesSubsc: Subscription;

  // Scrolling data
  private amViewingNewChannel = false;
  needToUpdateScroll = false;

  constructor(private interfaceSrv: InterfaceService, private cnbSrv: ChannelNavBarService, public messageSrv: MessagesService) { }

  ngOnInit() {
    this.initializeNodeSession();
    this.initializeAbbreviatedUserProfile();
    this.initializeAbilityToPost();
    this.initializeInterfaceViewListener();
    this.initializeChannelViewListener();

    // TODO What is the opening channel view? Do we need to call this.messagesService.emitNewChannelView on opening?

    // Listen for updated message list
    this.messagesSubsc = this.messageSrv.getMessageUpdateListener().subscribe((updatedMessages: Message[]) => {
      const diffNumberOfMessages = (this.messages.length !== updatedMessages.length);
      this.needToUpdateScroll = (this.amViewingNewChannel || diffNumberOfMessages);  // Don't scroll on reaction only
      this.messages = updatedMessages;
      this.amViewingNewChannel = false;  // Need to reset once on channel
    }); // First function, Second error, Third when observable completed
  }

  private initializeNodeSession() {
    this.nodeSession = this.interfaceSrv.getNodeSession();
    this.nodeSessionSubsc = this.interfaceSrv.getNodeSessionListener().subscribe(session => {
      this.nodeSession = session;
    });
  }

  private initializeAbbreviatedUserProfile() {
    this.userProfileAbr = this.interfaceSrv.getAbbreviatedUserProfile();
    this.userProfileAbrSubsc = this.interfaceSrv.getAbbreviatedUserProfileListener().subscribe(userAbr => {
      this.userProfileAbr = userAbr;
    });
  }

  private initializeAbilityToPost() {
    this.canPost = this.interfaceSrv.getCanPost();
    if (this.canPost != null) {
      this.updateComponentHeight();
    }
    this.canPostSubsc = this.interfaceSrv.getCanPostListener().subscribe(canPostNow => {
      this.canPost = canPostNow;
      this.updateComponentHeight();
    });
    this.isMutedSubsc = this.interfaceSrv.getIsMutedListener().subscribe(isMutedNow => {
      this.isMuted = isMutedNow;
      this.updateComponentHeight();
    });
  }

  private initializeInterfaceViewListener() {
    this.interfaceViewSubsc = this.cnbSrv.getInterfaceViewListener().subscribe(newView => {
      if (newView === c.VIEW_CHANNEL_MESSAGES) {
        this.isHidden = false;
      } else if (newView === c.VIEW_MUTE_MEMBERS) {
        this.isHidden = true;
      } else {
        console.log('The app could not render this view. It has either not been implemented or there is an incorrect reference.');
      }
    });
  }

  private initializeChannelViewListener() {
    // Listen for changes in which channel is being viewed TODO @Kai get messages in here!
    this.newChannelViewSubsc = this.interfaceSrv.getNewChannelViewListener().subscribe(newChannelViewID => {
      this.currentChannelID = newChannelViewID;
      this.updateComponentHeight();
      const dbpath = this.messageSrv.createChannelPath(this.nodeSession.rezzi, newChannelViewID);
      if (dbpath != null && dbpath !== undefined) {
        this.amViewingNewChannel = true;
        this.messageSrv.getChannelMessages(dbpath.channelPath, dbpath.channelName);  // Triggers msg upd listener
        this.messageSrv.emitNewChannelView(dbpath);  // eventually triggers addListenerForChannelMessages
      }
    });
  }

  /**
   * Header navbar height = 64px (mat-tool-bar default)
   * Channel navbar height = 64px (mat-tool-bar default)
   * app-new-message height = 90px (declared in new-message.component.css)
   * Partial screen if message bar is visible, which happens when I can post and I am not muted
   */
  private updateComponentHeight() {
    const chnMsg = document.getElementById('channelMessages');
    if (chnMsg != null) {
      if (this.canPost && !this.isMuted) {
        chnMsg.style.height = 'calc(100vh - 218px)';
      } else {
        chnMsg.style.height = 'calc(100vh - 128px)';
      }
    }
  }

  ngOnDestroy() {
    this.nodeSessionSubsc.unsubscribe();
    this.userProfileAbrSubsc.unsubscribe();
    this.canPostSubsc.unsubscribe();
    this.isMutedSubsc.unsubscribe();
    this.interfaceViewSubsc.unsubscribe();
    this.newChannelViewSubsc.unsubscribe();
    this.messagesSubsc.unsubscribe(); // useful when changing channels
  }

}
