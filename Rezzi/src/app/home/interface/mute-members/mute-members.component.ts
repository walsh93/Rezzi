import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { MemberMuteInfo } from 'src/app/classes.model';
import { RezziService } from 'src/app/rezzi.service';
import { InterfaceService } from '../interface.service';
import { ChannelNavBarService } from '../channel-nav-bar/channel-nav-bar.service';
import * as c from '../interface.constants';

@Component({
  selector: 'app-mute-members',
  templateUrl: './mute-members.component.html',
  styleUrls: ['./mute-members.component.css']
})
export class MuteMembersComponent implements OnInit, OnDestroy {
  // UI data
  title = 'Fetching residents...';
  message = 'Modify user posting privileges for this channel only';
  private channelMuteMap = new Map<string, Map<string, MemberMuteInfo>>();
  members: MatTableDataSource<MemberMuteInfo>;
  columnsToDisplay: string[] = ['fnameCol', 'lnameCol', 'emailCol', 'buttonCol'];

  // Viewing data
  isHidden = true;  // By default, want to show channel messages and new-message component
  private interfaceViewSubsc: Subscription;
  private currentChannelID: string;
  private newChannelViewSubsc: Subscription;

  constructor(private rezziSrv: RezziService, private interfaceSrv: InterfaceService, private cnbSrv: ChannelNavBarService,
              private http: HttpClient) { }

  ngOnInit() {
    this.initializeInterfaceViewListener();
    this.initializeChannelViewListener();
  }

  private initializeInterfaceViewListener() {
    this.interfaceViewSubsc = this.cnbSrv.getInterfaceViewListener().subscribe(newView => {
      if (newView === c.VIEW_MUTE_MEMBERS) {
        this.isHidden = false;
        this.updateResidentsTableData();
      } else {
        this.isHidden = true;
      }
    });
  }

  private initializeChannelViewListener() {
    // Listen for changes in which channel is being viewed TODO @Kai get messages in here!
    this.newChannelViewSubsc = this.interfaceSrv.getNewChannelViewListener().subscribe(newChannelViewID => {
      if (newChannelViewID !== this.currentChannelID) {
        this.currentChannelID = newChannelViewID;
        if (!this.isHidden) {
          this.updateResidentsTableData();  // Update if you are viewing the members, but the channel changed
        }
      }
    });
  }

  private updateResidentsTableData() {
    if (this.currentChannelID == null || this.currentChannelID === undefined) {
      return;
    }

    if (this.channelMuteMap.has(this.currentChannelID)) {
      console.log(`Pulling saved Member Mute Info map for ${this.currentChannelID}...`);
      const storedMap = this.channelMuteMap.get(this.currentChannelID);
      this.members = new MatTableDataSource(Array.from(storedMap.values()));
      this.title = 'Members in this channel';
      return;
    }

    this.rezziSrv.getResidentsByChannel(this.currentChannelID).then(res => {
      if (res == null || res === undefined) {
        return;
      } else if (res.msg != null && res.msg !== undefined) {
        console.log(res.msg);
      } else {
        console.log(`Creating new Member Mute Info map for ${this.currentChannelID}...`);
        const infoList = res.infoList as MemberMuteInfo[];
        const memMuteInfoMap = new Map<string, MemberMuteInfo>();
        infoList.forEach(user => {
          memMuteInfoMap.set(user.email, user);
        });
        this.channelMuteMap.set(this.currentChannelID, memMuteInfoMap);
        this.members = new MatTableDataSource(Array.from(memMuteInfoMap.values()));
        this.title = 'Members in this channel';
      }
    });
  }

  setMuteStatus(email: string, tf: string) {
    const isMuted = (tf === 'true');
    const body = { channelID: this.currentChannelID, email, isMuted };

    this.http.post('/update-is-muted', body).toPromise().then((response) => {
      const thenResponse = response as any;
      if (thenResponse.status >= 200 && thenResponse.status < 300) {
        const currentMap = this.channelMuteMap.get(this.currentChannelID);
        const muteInfo = currentMap.get(email);
        muteInfo.isMuted = isMuted;
        currentMap.set(email, muteInfo);
        this.channelMuteMap.set(this.currentChannelID, currentMap);
        this.members = new MatTableDataSource(Array.from(currentMap.values()));
      } else {
        console.log('update unsuccessful', thenResponse.error);  // TODO change to mat-dialog
      }
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status >= 200 && res.status < 300) {
        const currentMap = this.channelMuteMap.get(this.currentChannelID);
        const muteInfo = currentMap.get(email);
        muteInfo.isMuted = isMuted;
        currentMap.set(email, muteInfo);
        this.channelMuteMap.set(this.currentChannelID, currentMap);
        this.members = new MatTableDataSource(Array.from(currentMap.values()));
      } else {
        console.log('update unsuccessful');  // TODO change to mat-dialog
      }
    });
  }

  ngOnDestroy() {
    this.interfaceViewSubsc.unsubscribe();
    this.newChannelViewSubsc.unsubscribe();
  }

}
