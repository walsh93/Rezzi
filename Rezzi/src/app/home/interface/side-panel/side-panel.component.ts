import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoinChannelComponent } from './join-channel/join-channel.component';
import { SidePanelService } from './side-panel.service';
import { ChannelData, NodeSession, AbbreviatedUserProfile } from '../../../classes.model';
import { ChannelNavBarService } from '../channel-nav-bar/channel-nav-bar.service';
import { Subscription, Observable } from 'rxjs';
import { InterfaceService } from '../interface.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
  providers: [SidePanelService],
})

export class SidePanelComponent implements OnInit, OnDestroy {
  // Node session data
  private nodeSession: NodeSession;
  private nodeSessionSubsc: Subscription;

  // User profile data
  private userProfileAbr: AbbreviatedUserProfile;
  private userProfileAbrSubsc: Subscription;

  // Channel data
  private allChannels: ChannelData[];
  private allChannelsSubscr: Subscription;
  private myChannels: ChannelData[];
  private myChannelsSubscr: Subscription;




  public channels: ChannelData[];
  private filteredChannels: ChannelData[];
  status: boolean;
  channelRedirect: ChannelData;
  channelRedirectLevel: string;

  // Session data retrieved from interface.component
  session: any;
  private sessionUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('sessionUpdateEvent') sessionObs: Observable<any>;

  // Send channels to interface.component
  @Output() channelsToSend = new EventEmitter<ChannelData[]>();
  @Output() channelToView = new EventEmitter<string>();

  constructor(private interfaceService: InterfaceService, public dialog: MatDialog, private sidePanService: SidePanelService, private chanNavBarService: ChannelNavBarService) {
    this.refreshSidePanel();
  }

  refreshSidePanel(): void {
    this.channels = [];
    this.filteredChannels = [];
    this.sidePanService.getChannels().subscribe(data => {
      for (const hall in data) {
        if (data.hasOwnProperty(hall)) {
          let tempBelongs = false;  // Set if the user doesn't belong to any chats within the category
          const tempChannels: ChannelData[] = [];
          // tslint:disable-next-line: forin
          for (const channel in data[hall]) {
            tempChannels.push({
              id: hall + '-' + channel,
              channel,
              users: data[hall][channel].users,
              belongs: data[hall][channel].belongs,
              isMuted: data[hall][channel].isMuted,
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
                isMuted: data[hall][channel].isMuted,
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
            isMuted: false,
            subchannels: tempChannels,
            messages: []  // TODO does this temp thing have messages at any point???
          };
          this.channels.push(temp);
        }
      }
      this.channelRedirect = this.filteredChannels[0];
      this.channelRedirectLevel = this.channelRedirect.id.split('-')[0];
      this.channelsToSend.emit(this.filteredChannels);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(JoinChannelComponent, {
      width: '600px',
      height: 'auto',
      data: {
        channels: this.channels,
        session: this.session,
        user: this.userProfileAbr,
      },
    });

    dialogRef.componentInstance.joinChannelEvent.subscribe((id: string) => {
      this.channels.forEach(hall => {
        hall.subchannels.forEach(channel => {
          if (channel.id === id) {
            channel.belongs = true;
          }
        });
      });
    });
  }

  ngOnInit() {
    this.initializeNodeSession();
    this.initializeAbbreviatedUserProfile();
    this.initializeChannels();

    // Listen for session updates
    this.sessionUpdateSub = this.sessionObs.subscribe((updatedSession) => {
      this.session = updatedSession;
    });

    // Listen for channel updates, redirect for less channels
    this.chanNavBarService.currentChannelUpdateStatus.subscribe(status => {
      this.status = status;
      if (this.status === true) {
        this.refreshSidePanel();
        this.chanNavBarService.changeChannelUpdateStatus(false);
        console.log('Redirecting to ' + this.channelRedirect.id);
        this.viewChannel(this.channelRedirect, this.channelRedirectLevel);
      }
    });
  }

  private initializeNodeSession() {
    const session1 = this.interfaceService.getNodeSession();
    if (session1 == null) {
      this.nodeSessionSubsc = this.interfaceService.getNodeSessionListener().subscribe(session2 => {
        this.nodeSession = session2;
      });
    } else {
      this.nodeSession = session1;
    }
  }

  private initializeAbbreviatedUserProfile() {
    const userAbr1 = this.interfaceService.getAbbreviatedUserProfile();
    if (userAbr1 == null) {
      this.userProfileAbrSubsc = this.interfaceService.getAbbreviatedUserProfileListener().subscribe(userAbr2 => {
        this.userProfileAbr = userAbr2;
      });
    } else {
      this.userProfileAbr = userAbr1;
    }
  }

  private initializeChannels() {
    const allChannels1 = this.interfaceService.getAllChannels();
    if (allChannels1 == null) {
      this.allChannelsSubscr = this.interfaceService.getAllChannelsListener().subscribe(allChannels2 => {
        this.allChannels = allChannels2;
      });
    } else {
      this.allChannels = allChannels1;
    }
    const myChannels1 = this.interfaceService.getMyChannels();
    if (myChannels1 == null) {
      this.myChannelsSubscr = this.interfaceService.getMyChannelsListener().subscribe(myChannels2 => {
        this.myChannels = myChannels2;
      });
    } else {
      this.myChannels = myChannels1;
    }
  }

  viewChannel(channel: ChannelData, level: string) {
    this.chanNavBarService.setNavData(channel);
    let viewingChannelString = '';
    if (level != null) {
      if (level === 'hallwide' || level === 'RA') {  // Reconstruct the channel ID
        viewingChannelString = `${level}-${channel.channel}`;
      } else {
        viewingChannelString = `floors-${level}-${channel.channel}`;
      }
    } else {
      console.log('Show category accouncements??? What are we showing here?');  // TODO @Kai
      viewingChannelString = null;
    }
    this.channelToView.emit(viewingChannelString);
  }

  ngOnDestroy() {
    if (this.nodeSessionSubsc != null) {
      this.nodeSessionSubsc.unsubscribe();
    }
    if (this.userProfileAbrSubsc != null) {
      this.userProfileAbrSubsc.unsubscribe();
    }
    if (this.allChannelsSubscr != null) {
      this.allChannelsSubscr.unsubscribe();
    }
    if (this.myChannelsSubscr != null) {
      this.myChannelsSubscr.unsubscribe();
    }
    this.sessionUpdateSub.unsubscribe();
  }

}
