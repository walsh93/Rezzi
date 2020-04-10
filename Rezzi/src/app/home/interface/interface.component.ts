import { Component, OnInit, OnDestroy } from '@angular/core';
import { RezziService } from '../../rezzi.service';
import { ChannelData, User, AbbreviatedUser, NodeSession } from '../../classes.model';
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
  private channelMap = new Map<string, ChannelData>();
  private nodeSession: NodeSession;
  private nodeSessionSubsc: Subscription;
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
  hideNewMsgSubj: Subject<boolean> = new Subject<boolean>();

  constructor(private interfaceService: InterfaceService, private rezziService: RezziService, private cnbService: ChannelNavBarService) { }

  ngOnInit() {
    this.initializeComponentData();

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
        this.viewMuteMemSubj.next(false);
      } else if (newView === c.VIEW_MUTE_MEMBERS) {
        this.viewChanMesSubj.next(false);
        this.viewMuteMemSubj.next(true);
      } else {
        console.log('The app could not render this view. It has either not been implemented or there is an incorrect reference.');
      }
    });
  }

  private initializeComponentData() {
    const session1 = this.interfaceService.getNodeSession();
    if (session1 == null) {
      this.nodeSessionSubsc = this.interfaceService.getNodeSessionListener().subscribe(session2 => {
        this.initializeDataFromSession(session2);
      });
    } else {
      this.initializeDataFromSession(session1);
    }
  }

  private initializeDataFromSession(nodeSession: NodeSession) {
    this.nodeSession = nodeSession;
    this.resHall = nodeSession.rezzi;
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
  }

}
