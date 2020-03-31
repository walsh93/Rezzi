import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { ChannelNavBarService } from './channel-nav-bar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChannelData } from 'src/app/classes.model';
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
  navChannel: ChannelData;
  @HostBinding('class.nav-title')
  navTitle = 'Rezzi';
  channelMenuDisabled = true;
  leaveButtonDisabled = true;

  constructor(private channelNavBarService: ChannelNavBarService, public dialog: MatDialog) {}

  ngOnInit() {
    this.channelNavBarService.setChannel.subscribe(channelData => {
      this.navChannel = channelData;
      this.navTitle = this.navChannel.channel;
      if (this.navTitle !== 'Rezzi') {
        this.channelMenuDisabled = false;
      }
      if (this.navTitle !== 'General') {
        this.leaveButtonDisabled = false;
      } else {
        this.leaveButtonDisabled = true;
      }
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
