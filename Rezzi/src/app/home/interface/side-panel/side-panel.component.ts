import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoinChannelComponent } from './join-channel/join-channel.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {
  // Sample object
  channels = [
    {id: 6,
      channel: "Floor 2E",
      subchannels: [{id: 9, channel: "gamerz", users: 12}, {id: 10, channel: "best friends", users: 1}],
      users: 45},
    {id: 7, channel: "Hallwide", users: 112},
    {id: 8, channel: "RAs", users: 12412}
  ];

  constructor(public dialog: MatDialog, private router: Router) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(JoinChannelComponent, {
      width: '600px',
      height: 'auto',
      data: this.channels
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }

  goToCreateChannel() {
    this.router.navigate(['/create-channel']);
  }

  doTheThing() {
    console.log('help');
  }
}
