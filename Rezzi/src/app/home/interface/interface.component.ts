import { Component, OnInit, OnDestroy } from '@angular/core';
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





  private resHall: string;

  constructor(private interfaceService: InterfaceService, private cnbService: ChannelNavBarService) { }

  ngOnInit() {
    this.initializeNodeSession();
    this.initializeUserProfiles();
    this.initializeChannels();
  }

  private initializeNodeSession() {
    this.nodeSession = this.interfaceService.getNodeSession();
    if (this.nodeSession != null) {
      this.resHall = this.nodeSession.rezzi;
    }
    this.nodeSessionSubsc = this.interfaceService.getNodeSessionListener().subscribe(session => {
      this.nodeSession = session;
      this.resHall = session.rezzi;
    });
  }

  private initializeUserProfiles() {
    this.userProfile = this.interfaceService.getUserProfile();
    if (this.userProfile != null) {
      if (this.resHall == null || this.resHall === undefined) {
        this.resHall = this.userProfile.rezzi;
      }
      if (!this.userProfile.canPost) {  // Remove message bar is posting privileges have been revoked
        document.getElementById('newMessageBar').remove();
      }
    }
    this.userProfileSubsc = this.interfaceService.getUserProfileListener().subscribe(user => {
      this.userProfile = user;
      if (this.resHall == null || this.resHall === undefined) {
        this.resHall = user.rezzi;
      }
      if (!user.canPost) {  // Remove message bar is posting privileges have been revoked
        document.getElementById('newMessageBar').remove();
      }
    });
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
