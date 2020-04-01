import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { ChannelNavBarService } from './channel-nav-bar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChannelData } from 'src/app/classes.model';
import { RezziService } from 'src/app/rezzi.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface DialogData {
  channel: ChannelData;
}
@Component({
  selector: 'app-channel-nav-bar',
  templateUrl: './channel-nav-bar.component.html',
  styleUrls: ['./channel-nav-bar.component.css']
})

export class ChannelNavBarComponent implements OnInit {
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
      data: {channel: this.navChannel}
    });
  }

}

@Component({
  selector: 'app-leave-channel-dialog',
  templateUrl: 'leave-channel-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class LeaveChannelDialog {

  constructor(
    public dialogRef: MatDialogRef<LeaveChannelDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient) {}

  onCancelClick(): void {
    console.log('user cancelled leaving');
    this.dialogRef.close();
  }

  onConfirmClick(channel: ChannelData): void {
    console.log('user wants to leave ' + channel.channel);
    console.log('leaving channel id ' + channel.id);
    this.http.post<{notification: string}>('/leave-channel', {channel_id: channel.id})
    .subscribe(responseData => {
      console.log(responseData.notification);
    });
  }

}
