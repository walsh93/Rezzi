import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoinChannelComponent } from './join-channel/join-channel.component';
import { SidePanelService, ChannelData } from './side-panel.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
  providers: [SidePanelService],
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
  // channels: ChannelData[];

  constructor(public dialog: MatDialog, private sidePanelService: SidePanelService) {
    this.channels = [];
    this.sidePanelService.getChannels().subscribe(data => {
      console.log(data);
    });
  }

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

  doTheThing() {
    console.log('help');
  }
}
