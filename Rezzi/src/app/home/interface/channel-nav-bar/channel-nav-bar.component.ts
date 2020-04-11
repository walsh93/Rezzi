import { Component, OnInit, OnDestroy, HostBinding, Inject, Input, Output, EventEmitter } from '@angular/core';
import { ChannelNavBarService } from './channel-nav-bar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RezziService } from 'src/app/rezzi.service';
import { Router } from '@angular/router';
import { ChannelData, BotMessage, NodeSession, AbbreviatedUserProfile } from 'src/app/classes.model';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable, Subject } from 'rxjs';
import { MessagesService } from '../messages/messages.service';
import * as c from '../interface.constants';
import { InterfaceService } from '../interface.service';

export interface DialogData {
  channel: ChannelData;
  rezzi: string;
  userName: string;
}

@Component({
  selector: 'app-channel-nav-bar',
  templateUrl: './channel-nav-bar.component.html',
  styleUrls: ['./channel-nav-bar.component.css']
})

export class ChannelNavBarComponent implements OnInit, OnDestroy {
  // Node session data
  private nodeSession: NodeSession;
  private nodeSessionSubsc: Subscription;

  // User profile data
  private userProfileAbr: AbbreviatedUserProfile;
  private userProfileAbrSubsc: Subscription;



  user: string;
  accountType: number;
  channels: ChannelData[];
  navChannel: ChannelData;
  @HostBinding('class.nav-title')
  navTitle = 'Rezzi';

  // All buttons are disabled until permissions are checked on init
  channelMenuDisabled = true;
  muteButtonDisabled = true;
  leaveButtonDisabled = true;
  deleteButtonDisabled = true;

  private userName: string;

  constructor(private rezziService: RezziService,
              private router: Router,
              private channelNavBarService: ChannelNavBarService,
              public dialog: MatDialog,
              private interfaceService: InterfaceService) {
    this.initializeNodeSession();
    this.initializeAbbreviatedUserProfile();
  }

  private initializeNodeSession() {
    this.nodeSession = this.interfaceService.getNodeSession();
    this.nodeSessionSubsc = this.interfaceService.getNodeSessionListener().subscribe(session => {
      this.nodeSession = session;
    });
  }

  private initializeAbbreviatedUserProfile() {
    this.userProfileAbr = this.interfaceService.getAbbreviatedUserProfile();
    if (this.userProfileAbr != null) {
      this.initializeNickname();
    }
    this.userProfileAbrSubsc = this.interfaceService.getAbbreviatedUserProfileListener().subscribe(userAbr => {
      this.userProfileAbr = userAbr;
      this.initializeNickname();
    });
  }

  private initializeNickname() {
    if (this.userProfileAbr.nickName == null || this.userProfileAbr.nickName === undefined || this.userProfileAbr.nickName.length === 0) {
      this.userName = `${this.userProfileAbr.firstName} ${this.userProfileAbr.lastName}`;
    } else {
      this.userName = this.userProfileAbr.nickName;
    }
  }

  ngOnInit() {
    this.rezziService.getSession().then((response) => {
      if (response.email == null) {
        this.router.navigate(['/sign-in']);
      } else {
        this.user = response.email;
        this.accountType = response.accountType;
      }
    });

    this.channelNavBarService.setChannel.subscribe(channelData => {
      this.navChannel = channelData;
      this.navTitle = this.navChannel.channel;
      this.checkPermissions();
    });
  }

  checkPermissions() {
    if (this.navTitle !== 'Rezzi') {                              // Channel not selected
      this.channelMenuDisabled = false;
    }
    if (this.navTitle !== 'General') {                            // Cannot leave General channel
      this.leaveButtonDisabled = false;
    } else {
      this.leaveButtonDisabled = true;
    }
    if (this.accountType === 1 && this.navTitle !== 'General') {  // Must be RA to delete any non-general channel
      this.deleteButtonDisabled = false;
    } else if (this.accountType === 0) {                          // Must be HD to delete any channel
      this.deleteButtonDisabled = false;
    } else {
      this.deleteButtonDisabled = true;
    }
    if (this.accountType === 0 || this.accountType === 1) {       // Must be admin to mute members in a channel
      this.muteButtonDisabled = false;
    }
  }

  openLeaveDialog(): void {
    if (this.navTitle === 'Rezzi') {
      console.error('No channel selected');
      return;
    }

    const leaveDialogRef = this.dialog.open(LeaveChannelDialog, {
      width: '450px',
      height: '200px',
      data: {
        channel: this.navChannel,
        rezzi: this.nodeSession.rezzi,
        userName: this.userName,
      }
    });
  }

  openDeleteDialog(): void {
    if (this.navTitle === 'Rezzi') {
      console.error('No channel selected');
      return;
    }

    const deleteDialogRef = this.dialog.open(DeleteChannelDialog, {
      width: '450px',
      height: '200px',
      data: {
        channel: this.navChannel,
        rezzi: this.nodeSession.rezzi,
        userName: this.userName,
      }
    });
  }

  /**
   * Functions to trigger navbar service, and then the interface subscription
   */
  goToMuteMembersScreen() {
    this.channelNavBarService.updateInterfaceView(c.VIEW_MUTE_MEMBERS);
  }

  goToChannelMessagesScreen() {
    this.channelNavBarService.updateInterfaceView(c.VIEW_CHANNEL_MESSAGES);
  }

  ngOnDestroy() {
    if (this.nodeSessionSubsc != null) {
      this.nodeSessionSubsc.unsubscribe();
    }
    if (this.userProfileAbrSubsc != null) {
      this.userProfileAbrSubsc.unsubscribe();
    }
  }

}

/*  Leave Channel Dialog Component */

@Component({
  selector: 'app-leave-channel-dialog',
  templateUrl: 'leave-channel-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class LeaveChannelDialog implements OnInit {
  rezzi: string;
  userName: string;
  status: boolean;

  constructor(public leaveDialogRef: MatDialogRef<LeaveChannelDialog>,
              private channelNavBarService: ChannelNavBarService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private http: HttpClient,
              private messagesService: MessagesService) {
      this.rezzi = data.rezzi;
      this.userName = data.userName;
  }

  ngOnInit() {
    this.channelNavBarService.currentChannelUpdateStatus.subscribe(status => {
      this.status = status;
    });
  }

  onCancelClick(): void {
    console.log('user cancelled leaving');
    this.leaveDialogRef.close();
  }

  onConfirmClick(channel: ChannelData): void {
    console.log('user wants to leave ' + channel.channel);
    console.log('leaving channel id ' + channel.id);
    this.http.post<{notification: string}>('/leave-channel', {channel_id: channel.id}).subscribe(responseData => {
      console.log(responseData.notification);
    });

    this.channelNavBarService.changeChannelUpdateStatus(true);  /* Refreshes channel list */
    this.leaveDialogRef.close();                                /* Closes dialog */

    // Send Bot Message
    this.messagesService.addBotMessage(BotMessage.UserHasLeftChannel, this.userName, this.rezzi, channel.id);
  }

}

/* Delete Channel Dialog Component */
@Component({
  selector: 'app-delete-channel-dialog',
  templateUrl: 'delete-channel-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class DeleteChannelDialog implements OnInit {
  rezzi: string;
  userName: string;
  status: boolean;

  constructor(public deleteDialogRef: MatDialogRef<DeleteChannelDialog>,
              private channelNavBarService: ChannelNavBarService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private http: HttpClient,
              private messagesService: MessagesService) {
      this.rezzi = data.rezzi;
      this.userName = data.userName;
  }

  ngOnInit() {
    this.channelNavBarService.currentChannelUpdateStatus.subscribe(status => {
      this.status = status;
    });
  }

  onCancelClick(): void {
    this.deleteDialogRef.close();
  }

  onConfirmClick(channel: ChannelData): void {
    console.log('user wants to delete ' + channel.channel);
    console.log('deleting channel id ' + channel.id);
    const level = channel.id.split('-')[0];
    this.http.post<{notification: string}>('/delete-channel', {channel, channel_level: level}).subscribe(responseData => {
      console.log(responseData.notification);
    });

    this.channelNavBarService.changeChannelUpdateStatus(true);
    this.deleteDialogRef.close();
  }

}
