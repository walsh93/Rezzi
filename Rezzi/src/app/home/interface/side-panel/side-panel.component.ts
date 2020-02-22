import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoinChannelComponent } from './join-channel/join-channel.component';
import { SidePanelService } from './side-panel.service';
import { ChannelData } from '../../../classes.model';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
  providers: [SidePanelService],
})
export class SidePanelComponent implements OnInit {
  // Sample object
  channels: ChannelData[];

  constructor(public dialog: MatDialog, private sidePanelService: SidePanelService) {
    this.channels = [];
    this.sidePanelService.getChannels().subscribe(data => {
      for (var hall in data) {
        if (data.hasOwnProperty(hall)) {
          var temp_belongs = false;  // Set if the user doesn't belong to any chats within the category
          var temp_channels: ChannelData[] = [];
          for (var channel in data[hall]) {
            temp_channels.push({
              id: hall + '-' + channel,
              channel: channel,
              users: data[hall][channel].users,
              belongs: data[hall][channel].belongs,
              subchannels: []
            });
            if (data[hall][channel].belongs) {
              temp_belongs = true;
            }
          }
          var temp: ChannelData = {
            id: '',
            channel: hall,
            users: -1,
            belongs: temp_belongs,
            subchannels: temp_channels
          };
          this.channels.push(temp);
        }
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(JoinChannelComponent, {
      width: '600px',
      height: 'auto',
      data: this.channels,
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  ngOnInit() {
  }

}
