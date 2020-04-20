import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { MemberMuteInfo } from 'src/app/classes.model';
import { RezziService } from 'src/app/rezzi.service';
import { InterfaceService } from '../interface.service';
import { ChannelNavBarService } from '../channel-nav-bar/channel-nav-bar.service';
import * as c from '../interface.constants';

@Component({
  selector: 'app-view-members',
  templateUrl: './view-members.component.html',
  styleUrls: ['./view-members.component.css']
})
export class ViewMembersComponent implements OnInit, OnDestroy {

  title = 'Fetching residents...';
  message = 'Modify user posting privileges for this channel only';
  private channelMuteMap = new Map<string, Map<string, MemberMuteInfo>>();
  members: MatTableDataSource<MemberMuteInfo>;
  columnsToDisplay: string[] = ['fnameCol', 'lnameCol', 'emailCol'];

  // Asynchronous data from parent component
  isHidden = true;  // By default, want to show channel messages and new-message component
  private interfaceViewSubsc: Subscription;

  // Current channel retrieved from interface.component
  private currentChannelID: string;

  constructor(private rezziService: RezziService, private interfaceSrv: InterfaceService, private cnbSrv: ChannelNavBarService) { }

  ngOnInit() {
    this.initializeInterfaceViewListener();
  }

  private initializeInterfaceViewListener() {
    this.interfaceViewSubsc = this.cnbSrv.getInterfaceViewListener().subscribe(newView => {
      if (newView === c.VIEW_VIEW_MEMBERS) {
        this.isHidden = false;
        this.updateResidentsTableData();
      } else {
        this.isHidden = true;
      }
    });
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

  ngOnDestroy() {
    this.interfaceViewSubsc.unsubscribe();
  }

}
