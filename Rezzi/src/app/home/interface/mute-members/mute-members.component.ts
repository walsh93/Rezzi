import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { MemberMuteInfo } from 'src/app/classes.model';
import { RezziService } from 'src/app/rezzi.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    if (tf === 'true') {
      console.log(`I want to mute ${email}`);
    } else {
      console.log(`I want to unmute ${email}`);
    }
  }

}
