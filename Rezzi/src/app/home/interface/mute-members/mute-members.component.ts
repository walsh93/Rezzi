import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MemberMuteInfo } from 'src/app/classes.model';
import { RezziService } from 'src/app/rezzi.service';

@Component({
  selector: 'app-mute-members',
  templateUrl: './mute-members.component.html',
  styleUrls: ['./mute-members.component.css']
})
export class MuteMembersComponent implements OnInit, OnDestroy {

  title = 'Fetching residents...';
  message = 'Modify user posting privileges for this channel only';
  private channelMuteMap = new Map<string, Map<string, MemberMuteInfo>>();
  members: MatTableDataSource<MemberMuteInfo>;
  columnsToDisplay: string[] = ['fnameCol', 'lnameCol', 'emailCol', 'buttonCol'];

  // Asynchronous data from parent component
  isHidden = true;  // By default, want to show channel messages and new-message component
  private isHiddenSubsc: Subscription;
  @Input() isHiddenObs: Observable<boolean>;

  // Current channel retrieved from interface.component
  private currentChannelID: string;
  private viewingUpdateSub: Subscription;
  @Input() viewingObs: Observable<string>;

  constructor(private rezziService: RezziService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    // Listen for whether or not to view this in the interface or some other component
    this.isHiddenSubsc = this.isHiddenObs.subscribe((viewNow) => {
      if (this.isHidden === viewNow) {
        this.isHidden = !viewNow;
        if (viewNow) {
          this.updateResidentsTableData();  // Update if you are viewing now, but you weren't before
        }
      }
    });

    // Listen for changes in which channel is being viewed TODO @Kai get messages in here!
    this.viewingUpdateSub = this.viewingObs.subscribe((updatedChannelID) => {
      if (updatedChannelID !== this.currentChannelID) {
        this.currentChannelID = updatedChannelID;
        if (!this.isHidden) {
          this.updateResidentsTableData();  // Update if you are viewing the members, but the channel changed
        }
      }
    });
  }

  ngOnDestroy() {
    this.isHiddenSubsc.unsubscribe();
    this.viewingUpdateSub.unsubscribe();
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

    this.rezziService.getResidentsByChannel(this.currentChannelID).then(res => {
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

}
