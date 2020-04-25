import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MemberMuteInfo } from 'src/app/classes.model';
import { RezziService } from 'src/app/rezzi.service';

@Component({
  selector: 'app-view-members',
  templateUrl: './view-members.component.html',
  styleUrls: ['./view-members.component.css']
})
export class ViewMembersComponent implements OnInit {

  title = 'Fetching residents...';
  message = 'Modify user posting privileges for this channel only';
  private channelMuteMap = new Map<string, Map<string, MemberMuteInfo>>();
  members: MatTableDataSource<MemberMuteInfo>;
  columnsToDisplay: string[] = ['fnameCol', 'lnameCol', 'emailCol'];

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
      const storedMap = this.channelMuteMap.get(this.currentChannelID);
      this.members = new MatTableDataSource(Array.from(storedMap.values()));
      this.title = 'Members in this channel';
      return;
    }
this.rezziService.getResidentsByChannelNonAdmin(this.currentChannelID).then(res => {
      if (res == null || res === undefined) {
        return;
      } else if (res.msg != null && res.msg !== undefined) {
        console.log(res.msg);
      } else {
        const infoList = res.infoList as MemberMuteInfo[];
        const memInfoMap = new Map<string, MemberMuteInfo>();
        infoList.forEach(user => {
          memInfoMap.set(user.email, user);
        });
        this.channelMuteMap.set(this.currentChannelID, memInfoMap);
        this.members = new MatTableDataSource(Array.from(memInfoMap.values()));
        this.title = 'Members in this channel';
      }
    });
  }

}
