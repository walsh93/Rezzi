import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../rezzi.service';
import { ChannelData, User, AbbreviatedUser } from '../../classes.model';
import { Subject, Subscription } from 'rxjs';
import { ChannelNavBarService } from './channel-nav-bar/channel-nav-bar.service';
import * as c from './interface.constants';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  private channelMap = new Map<string, ChannelData>();
  session: any;
  resHall: string;
  user: User;
  abbrevUser: AbbreviatedUser;

  // Passing channels and session to child component channel-messages every time they update
  sessionUpdateSubject: Subject<any> = new Subject<any>();
  abbrevUserUpdateSubject: Subject<AbbreviatedUser> = new Subject<AbbreviatedUser>();
  channelsUpdateSubject: Subject<ChannelData[]> = new Subject<ChannelData[]>();
  viewingUpdateSubject: Subject<string> = new Subject<string>();
  canPostUpdate: Subject<boolean> = new Subject<boolean>();

  // Variables to track which interface view should appear (triggered by channel navbar and service)
  interfaceViewSubscr: Subscription;
  viewChanMesSubj: Subject<boolean> = new Subject<boolean>();
  viewMuteMemSubj: Subject<boolean> = new Subject<boolean>();
  viewViewMemSubj: Subject<boolean> = new Subject<boolean>();
  viewCalSubj: Subject<boolean> = new Subject<boolean>();
  hideNewMsgSubj: Subject<boolean> = new Subject<boolean>();

  constructor(private rezziService: RezziService, private cnbService: ChannelNavBarService) { }

  ngOnInit() {
    this.rezziService.getSession().then((session) => {
      this.session = session;
      this.sessionUpdateSubject.next(session);
      this.resHall = this.session.rezzi;
      this.rezziService.getUserProfile().then(response => {
        // Remove message bar is posting privileges have been revoked
        if (!response.user.canPost) {
          document.getElementById('newMessageBar').remove();
          this.canPostUpdate.next(false);
        } else {
          this.canPostUpdate.next(true);
        }
        this.user = new User(
          response.user.email,
          response.user.password,
          response.user.firstName,
          response.user.lastName,
          response.user.age,
          response.user.major,
          response.user.nickName,
          response.user.bio,
          true,
          response.user.deletionRequest,
          response.user.image_url,
        );
      });

      if (this.session.email != null && this.session.email !== undefined) {
        this.rezziService.getUserProfile().then((response) => {
          this.abbrevUser = new AbbreviatedUser(response.user.email, response.user.firstName,
            response.user.lastName, response.user.nickName, response.user.image_url);
          this.abbrevUserUpdateSubject.next(this.abbrevUser);

          if (this.resHall == null || this.resHall === undefined) {
            this.resHall = response.user.rezzi;
          }
        });
      }
    });

    // Listen for changes in the interface view
    this.interfaceViewSubscr = this.cnbService.getInterfaceViewListener().subscribe(newView => {
      if (newView === c.VIEW_CHANNEL_MESSAGES) {
        this.viewChanMesSubj.next(true);
        this.viewViewMemSubj.next(false);
        this.viewMuteMemSubj.next(false);
        this.viewCalSubj.next(false);
      } else if (newView === c.VIEW_MUTE_MEMBERS) {
        this.viewChanMesSubj.next(false);
        this.viewMuteMemSubj.next(true);
        this.viewViewMemSubj.next(false);
        this.viewCalSubj.next(false);
      } else if (newView === c.VIEW_VIEW_MEMBERS) {
        this.viewViewMemSubj.next(true);
        this.viewChanMesSubj.next(false);
        this.viewMuteMemSubj.next(false);
        this.viewCalSubj.next(false);
      } else if (newView === c.VIEW_CALENDAR) {
        this.viewCalSubj.next(true);
        this.viewChanMesSubj.next(false);
        this.viewMuteMemSubj.next(false);
        this.viewViewMemSubj.next(false);
      }
      else {
        console.log('The app could not render this view. It has either not been implemented or there is an incorrect reference.');
      }
    });
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

}
