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

  // User profile data
  private userProfile: UserProfile;
  private userProfileSubsc: Subscription;

  constructor(private interfaceService: InterfaceService, private cnbService: ChannelNavBarService) { }

  ngOnInit() {
    this.userProfile = this.interfaceService.getUserProfile();
    if (this.userProfile != null && !this.userProfile.canPost) {  // Remove message bar is posting privileges have been revoked
      document.getElementById('newMessageBar').remove();
    }
    this.userProfileSubsc = this.interfaceService.getUserProfileListener().subscribe(user => {
      this.userProfile = user;
      if (!user.canPost) {  // Remove message bar is posting privileges have been revoked
        document.getElementById('newMessageBar').remove();
      }
    });
  }

  ngOnDestroy() {
    this.userProfileSubsc.unsubscribe();
  }

}
