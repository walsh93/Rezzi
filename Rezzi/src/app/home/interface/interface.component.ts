import { Component, OnInit, OnDestroy } from '@angular/core';
import { RezziService } from '../../rezzi.service';
import { ChannelData, NodeSession, AbbreviatedUserProfile, UserProfile } from '../../classes.model';
import { Subject, Subscription } from 'rxjs';
import { ChannelNavBarService } from './channel-nav-bar/channel-nav-bar.service';
import * as c from './interface.constants';
import { InterfaceService } from './interface.service';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit, OnDestroy {
  // Node session data
  private nodeSession: NodeSession;
  private nodeSessionSubsc: Subscription;

  // User profile data
  private userProfile: UserProfile;
  private userProfileSubsc: Subscription;
  private userProfileAbr: AbbreviatedUserProfile;
  private userProfileAbrSubsc: Subscription;

  // Channel data
  private allChannels: ChannelData[];
  private allChannelsSubscr: Subscription;
  private myChannels: ChannelData[];
  private myChannelsSubscr: Subscription;




  private channelMap = new Map<string, ChannelData>();
  private resHall: string;

  // Passing channels and session to child component channel-messages every time they update
  channelsUpdateSubject: Subject<ChannelData[]> = new Subject<ChannelData[]>();
  viewingUpdateSubject: Subject<string> = new Subject<string>();
  canPostUpdate: Subject<boolean> = new Subject<boolean>();

  // Variables to track which interface view should appear (triggered by channel navbar and service)
  interfaceViewSubscr: Subscription;
  viewChanMesSubj: Subject<boolean> = new Subject<boolean>();
  viewMuteMemSubj: Subject<boolean> = new Subject<boolean>();
  hideNewMsgSubj: Subject<boolean> = new Subject<boolean>();

  constructor(private interfaceService: InterfaceService, private rezziService: RezziService, private cnbService: ChannelNavBarService) { }

  ngOnInit() {
    this.initializeNodeSession();
    this.initializeUserProfiles();
    this.initializeChannels();

    // Listen for changes in the interface view
    this.interfaceViewSubscr = this.cnbService.getInterfaceViewListener().subscribe(newView => {
      if (newView === c.VIEW_CHANNEL_MESSAGES) {
        this.viewChanMesSubj.next(true);
        this.viewMuteMemSubj.next(false);
      } else if (newView === c.VIEW_MUTE_MEMBERS) {
        this.viewChanMesSubj.next(false);
        this.viewMuteMemSubj.next(true);
      } else {
        console.log('The app could not render this view. It has either not been implemented or there is an incorrect reference.');
      }
    });
  }

  private initializeNodeSession() {
    const session1 = this.interfaceService.getNodeSession();
    if (session1 == null) {
      this.nodeSessionSubsc = this.interfaceService.getNodeSessionListener().subscribe(session2 => {
        this.nodeSession = session2;
        this.resHall = session2.rezzi;
      });
    } else {
      this.nodeSession = session1;
      this.resHall = session1.rezzi;
    }
  }

  private initializeUserProfiles() {
    const user1 = this.interfaceService.getUserProfile();
    if (user1 == null) {
      this.userProfileSubsc = this.interfaceService.getUserProfileListener().subscribe(user2 => {
        this.userProfile = user2;
        if (this.resHall == null || this.resHall === undefined) {
          this.resHall = user2.rezzi;
        }
        if (!user2.canPost) {  // Remove message bar is posting privileges have been revoked
          document.getElementById('newMessageBar').remove();
          this.canPostUpdate.next(false);
        } else {
          this.canPostUpdate.next(true);
        }
      });
    } else {
      this.userProfile = user1;
      if (this.resHall == null || this.resHall === undefined) {
        this.resHall = user1.rezzi;
      }
      if (!user1.canPost) {  // Remove message bar is posting privileges have been revoked
        document.getElementById('newMessageBar').remove();
        this.canPostUpdate.next(false);
      } else {
        this.canPostUpdate.next(true);
      }
    }
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

  receivedChannels(channels: ChannelData[]) {
    this.channelsUpdateSubject.next(channels);
    channels.forEach(channelData => {
      this.channelMap.set(channelData.id, channelData);
    });
  }

  viewingNewChannel(channelID: string) {
    this.viewingUpdateSubject.next(channelID);
    if (this.channelMap.has(channelID)) {
      this.hideNewMsgSubj.next(this.channelMap.get(channelID).isMuted);
    }
  }

  ngOnDestroy() {
    if (this.nodeSessionSubsc != null) {
      this.nodeSessionSubsc.unsubscribe();
    }
    if (this.userProfileSubsc != null) {
      this.userProfileSubsc.unsubscribe();
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
