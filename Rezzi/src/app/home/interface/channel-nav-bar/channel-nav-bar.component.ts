import { Component, OnInit, HostBinding, Inject, Input, OnDestroy } from '@angular/core';
import { ChannelNavBarService } from './channel-nav-bar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RezziService } from 'src/app/rezzi.service';
import { Router } from '@angular/router';
import { ChannelData, AbbreviatedUser, BotMessage } from 'src/app/classes.model';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { MessagesService } from '../messages/messages.service';

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
  user: string;
  accountType: number;
  channels: ChannelData[];
  navChannel: ChannelData;
  @HostBinding('class.nav-title')
  navTitle = 'Rezzi';

  // All buttons are disabled until permissions are checked on init
  channelMenuDisabled = true;
  leaveButtonDisabled = true;
  deleteButtonDisabled = true;

  private userName: string;

  // Session data retrieved from interface.component
  session: any;
  private sessionUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('sessionUpdateEvent') sessionObs: Observable<any>;

  // Abbreviated User data
  abbrevUser: AbbreviatedUser;
  private userUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('abbrevUserUpdateEvent') userObs: Observable<AbbreviatedUser>;

  constructor(private rezziService: RezziService,
              private router: Router,
              private channelNavBarService: ChannelNavBarService,
              public dialog: MatDialog) {}

  checkPermissions() {
    if (this.navTitle !== 'Rezzi') {    // Channel not selected
      this.channelMenuDisabled = false;
    }
    if (this.navTitle !== 'General' && this.accountType === 2) {  // Cannot leave General channel
      this.leaveButtonDisabled = false;
    } else {
      this.leaveButtonDisabled = true;
    }
    if (this.accountType === 1 && this.navTitle !== 'General') {    // Must be RA to delete any non-general channel
      this.deleteButtonDisabled = false;
    } else if (this.accountType === 0) {                            // Must be HD to delete any channel
      this.deleteButtonDisabled = false;
    } else {
      this.deleteButtonDisabled = true;
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

    // Listen for session updates
    this.sessionUpdateSub = this.sessionObs.subscribe((updatedSession) => {
      this.session = updatedSession;
    });

    // Listen for user updates
    this.userUpdateSub = this.userObs.subscribe((updatedUser) => {
      this.abbrevUser = updatedUser;
      if (this.abbrevUser.nickName == null || this.abbrevUser.nickName === undefined || this.abbrevUser.nickName.length === 0) {
        this.userName = `${this.abbrevUser.firstName} ${this.abbrevUser.lastName}`;
      } else {
        this.userName = this.abbrevUser.nickName;
      }
    });
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
    this.userUpdateSub.unsubscribe();
  }

  openLeaveDialog(): void {
    if (this.navTitle === 'Rezzi') {
      console.error('No channel selected');
      return;
    }

    console.log('attempting to open dialog for ' + this.navTitle);

    const dialogRef = this.dialog.open(LeaveChannelDialog, {
      width: '450px',
      height: '200px',
      data: {
        channel: this.navChannel,
        rezzi: this.session.rezzi,
        userName: this.userName,
      }
    });
  }

}

@Component({
  selector: 'app-leave-channel-dialog',
  templateUrl: 'leave-channel-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class LeaveChannelDialog {

  rezzi: string;
  userName: string;

  constructor(public dialogRef: MatDialogRef<LeaveChannelDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private http: HttpClient, private messagesService: MessagesService) {
      this.rezzi = data.rezzi;
      this.userName = data.userName;
    }

  onCancelClick(): void {
    console.log('user cancelled leaving');
    this.dialogRef.close();
  }

  onConfirmClick(channel: ChannelData): void {
    console.log('user wants to leave ' + channel.channel);
    console.log('leaving channel id ' + channel.id);
    this.http.post<{notification: string}>('/leave-channel', {channel_id: channel.id}).subscribe(responseData => {
      console.log(responseData.notification);
    });

    // Send Bot Message
    this.messagesService.addBotMessage(BotMessage.UserHasLeftChannel, this.userName, this.rezzi, channel.id);
  }

}
