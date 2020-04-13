import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JoinChannelComponent } from './join-channel/join-channel.component';
import { SidePanelService } from './side-panel.service';
import { ChannelData, NodeSession, AbbreviatedUserProfile } from '../../../classes.model';
import { ChannelNavBarService } from '../channel-nav-bar/channel-nav-bar.service';
import { Subscription } from 'rxjs';
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
  allChannels: ChannelData[];
  private allChannelsSubscr: Subscription;
  private myChannels: ChannelData[];
  private myChannelsSubscr: Subscription;
  private channelRedirect: ChannelData;
  private channelRedirectLevel: string;

  status: boolean;

  constructor(private sidePanService: SidePanelService, private interfaceService: InterfaceService,
              private chanNavBarService: ChannelNavBarService, public dialog: MatDialog) {
    this.refreshSidePanel();
  }

  refreshSidePanel(): void {
    this.allChannels = [];
    this.myChannels = [];
    this.sidePanService.getChannels().then(arrays => {
      this.allChannels = arrays.allChannels;
      this.myChannels = arrays.myChannels;
      this.channelRedirect = this.myChannels[0];
      this.channelRedirectLevel = this.channelRedirect.id.split('-')[0];
    });
  }

  ngOnInit() {
    this.initializeNodeSession();
    this.initializeAbbreviatedUserProfile();
    this.initializeChannels();


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
    this.nodeSession = this.interfaceService.getNodeSession();
    this.nodeSessionSubsc = this.interfaceService.getNodeSessionListener().subscribe(session => {
      this.nodeSession = session;
    });
  }

  private initializeAbbreviatedUserProfile() {
    this.userProfileAbr = this.interfaceService.getAbbreviatedUserProfile();
    this.userProfileAbrSubsc = this.interfaceService.getAbbreviatedUserProfileListener().subscribe(userAbr => {
      this.userProfileAbr = userAbr;
    });
  }

  private initializeChannels() {
    this.allChannels = this.interfaceService.getAllChannels();
    this.allChannelsSubscr = this.interfaceService.getAllChannelsListener().subscribe(allChannels => {
      this.allChannels = allChannels;
    });
    this.myChannels = this.interfaceService.getMyChannels();
    this.myChannelsSubscr = this.interfaceService.getMyChannelsListener().subscribe(myChannels => {
      this.myChannels = myChannels;
    });
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
    this.interfaceService.setNewChannelView(viewingChannelString);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(JoinChannelComponent, {
      width: '600px',
      height: 'auto',
      data: {
        channels: this.allChannels,
        session: this.nodeSession,
        user: this.userProfileAbr,
      },
    });

    dialogRef.componentInstance.joinChannelEvent.subscribe((id: string) => {
      this.allChannels.forEach(hall => {
        hall.subchannels.forEach(channel => {
          if (channel.id === id) {
            channel.belongs = true;
          }
        });
      });
    });
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
  }

}
