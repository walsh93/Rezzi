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
  @Output() channelToView = new EventEmitter<string>();

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
              channel,
              users: data[hall][channel].users,
              belongs: data[hall][channel].belongs,
              subchannels: [],
              messages: data[hall][channel].messages
            });
            if (data[hall][channel].belongs) {
              tempBelongs = true;
            }

            // Filtered channels for sibling components
            if (data[hall][channel].belongs) {
              this.filteredChannels.push({
                id: hall + '-' + channel,
                channel,
                users: data[hall][channel].users,
                belongs: data[hall][channel].belongs,
                subchannels: [],
                messages: data[hall][channel].messages
              });
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
            subchannels: tempChannels,
            messages: []  // TODO does this temp thing have messages at any point???
          };
          this.channels.push(temp);
        }
      }
//      console.log(this.channels);
      this.channelsToSend.emit(this.filteredChannels);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(JoinChannelComponent, {
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

  viewChannel(channel: ChannelData, level: string) {
    this.channelNavBarService.setNavData(channel);

    let viewingChannelString = '';
    if (level != null) {
      if (level === 'hallwide' || level === 'RA') {  // Reconstruct the channel ID
        viewingChannelString = `${level}-${channel}`;
      } else {
        viewingChannelString = `floors-${level}-${channel}`;
      }
    } else {
      console.log('Show category accouncements??? What are we showing here?');  // TODO @Kai
      viewingChannelString = null;
    }
    this.channelToView.emit(viewingChannelString);
  }

}
