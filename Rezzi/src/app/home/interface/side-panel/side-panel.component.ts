import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoinChannelComponent } from './join-channel/join-channel.component';
import { SidePanelService } from './side-panel.service';
import { ChannelData } from '../../../classes.model';
import { ChannelNavBarService } from '../channel-nav-bar/channel-nav-bar.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
  providers: [SidePanelService],
})
export class SidePanelComponent implements OnInit {
  public channels: ChannelData[];

  constructor(public dialog: MatDialog,
    private sidePanelService: SidePanelService,
    private channelNavBarService: ChannelNavBarService) {
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
          var name = hall;
          if (hall.indexOf('floors') !== -1) {  // only use the back half of 'floors-...'
            name = hall.split('-')[1];
          }
          var temp: ChannelData = {
            id: '',
            channel: name,
            users: -1,
            belongs: temp_belongs,
            subchannels: temp_channels
          };
          this.channels.push(temp);
        }
      }
      console.log(this.channels);
    });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(JoinChannelComponent, {
      width: '600px',
      height: 'auto',
      data: this.channels,
    });
    dialogRef.componentInstance.join_channel_event.subscribe((id: string) => {
      this.channels.forEach(hall => {
        hall.subchannels.forEach(channel => {
          if (channel.id === id) {
            channel.belongs = true;
          }
        })
      })
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  ngOnInit() {
  }

  viewChannel(channel: string) {
    this.channelNavBarService.setNavTitle(channel);
  }

}
