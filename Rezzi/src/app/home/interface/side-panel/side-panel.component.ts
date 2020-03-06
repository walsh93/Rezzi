import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  private filteredChannels: ChannelData[];

  // Send channels to interface.component
  @Output() channelsToSend = new EventEmitter<ChannelData[]>();

  constructor(public dialog: MatDialog,
              private sidePanelService: SidePanelService,
              private channelNavBarService: ChannelNavBarService) {
    this.channels = [];
    this.filteredChannels = [];
    this.sidePanelService.getChannels().subscribe(data => {
      for (const hall in data) {
        if (data.hasOwnProperty(hall)) {
          let tempBelongs = false;  // Set if the user doesn't belong to any chats within the category
          let tempChannels: ChannelData[] = [];
          // tslint:disable-next-line: forin
          for (const channel in data[hall]) {
            tempChannels.push({
              id: hall + '-' + channel,
              channel: channel,
              users: data[hall][channel].users,
              belongs: data[hall][channel].belongs,
              subchannels: []
            });
            if (data[hall][channel].belongs) {
              tempBelongs = true;
            }
          }
          let name = hall;
          if (hall.indexOf('floors') !== -1) {  // only use the back half of 'floors-...'
            name = hall.split('-')[1];
          }
          const temp: ChannelData = {
            id: '',
            channel: name,
            users: -1,
            belongs: tempBelongs,
            subchannels: tempChannels
          };
          this.channels.push(temp);
          if (tempBelongs) {
            this.filteredChannels.push(temp);
          }
        }
      }
      // console.log(this.channels);
      this.channelsToSend.emit(this.filteredChannels);
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
        });
      });
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
