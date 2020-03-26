import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { ChannelNavBarService } from './channel-nav-bar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChannelData } from 'src/app/classes.model';
import { RezziService } from 'src/app/rezzi.service';
import { Router } from '@angular/router';

export interface DialogData {
  channel: string;
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
    if (this.navTitle !== 'General') {  // Cannot leave General channel
      this.leaveButtonDisabled = false;
    }
    if (this.accountType < 2) {         // Must be RA or HD to delete
      this.deleteButtonDisabled = false;
    }
  }

  ngOnInit() {
    this.channelNavBarService.setTitle.subscribe(navTitle => {
      this.navTitle = navTitle;
      this.checkPermissions();
    });

    this.rezziService.getSession().then((response) => {
      if (response.email == null) {
        this.router.navigate(['/sign-in']);
      } else {
        this.user = response.email;
        this.accountType = response.accountType;
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
      data: {channel: this.navTitle}
    });

  }

  leaveChannel() {
    console.log('user wants to leave ' + this.navTitle);
    // TODO also figure out how to pass in channel.id, follow join-channel.component.ts for help
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onCancelClick(): void {
    console.log('user cancelled leaving');
    this.dialogRef.close();
  }

  onConfirmClick(channel: string): void {
    console.log('user wants to leave ' + channel);
  }

}
