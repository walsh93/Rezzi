import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfile, NodeSession } from '../../classes.model';
import { Subscription, Subject } from 'rxjs';
import { InterfaceService } from './interface.service';
import { RezziService } from 'src/app/rezzi.service';
import * as c from './interface.constants';
import { ChannelNavBarService } from './channel-nav-bar/channel-nav-bar.service';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit, OnDestroy {

  // User profile data
  private userProfile: UserProfile;
  private userProfileSubsc: Subscription;

  // Variables to track which interface view should appear (triggered by channel navbar and service)
  interfaceViewSubscr: Subscription;
  viewChanMesSubj: Subject<boolean> = new Subject<boolean>();
  viewMuteMemSubj: Subject<boolean> = new Subject<boolean>();
  viewViewMemSubj: Subject<boolean> = new Subject<boolean>();
  hideNewMsgSubj: Subject<boolean> = new Subject<boolean>();

  constructor(private rezziSrv: RezziService, private interfaceSrv: InterfaceService, private cnbService: ChannelNavBarService) { }

  ngOnInit() {
    this.initializeProfileData();
    this.rezziSrv.getSession().then((session: NodeSession) => {
      if (session.email !== this.userProfile.email) {
        this.interfaceSrv.reinitializeServiceData();
      }
    });

    // Listen for changes in the interface view
    this.interfaceViewSubscr = this.cnbService.getInterfaceViewListener().subscribe(newView => {
      if (newView === c.VIEW_CHANNEL_MESSAGES) {
        this.viewChanMesSubj.next(true);
        this.viewViewMemSubj.next(false);
        this.viewMuteMemSubj.next(false);
      } else if (newView === c.VIEW_MUTE_MEMBERS) {
        this.viewChanMesSubj.next(false);
        this.viewMuteMemSubj.next(true);
        this.viewViewMemSubj.next(false);
      } else if (newView === c.VIEW_VIEW_MEMBERS) {
        this.viewViewMemSubj.next(true);
        this.viewChanMesSubj.next(false);
        this.viewMuteMemSubj.next(false);
      } else {
        console.log('The app could not render this view. It has either not been implemented or there is an incorrect reference.');
      }
    });
  }

  private initializeProfileData() {
    this.userProfile = this.interfaceSrv.getUserProfile();
    if (this.userProfile != null && !this.userProfile.canPost) {  // Remove message bar is posting privileges have been revoked
      document.getElementById('newMessageBar').remove();
    }
    this.userProfileSubsc = this.interfaceSrv.getUserProfileListener().subscribe(user => {
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
