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
  private memMuteInfoMap = new Map<string, MemberMuteInfo>();
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
      this.isHidden = !viewNow;

      if (viewNow) {
        this.rezziService.getResidentsByChannel(this.currentChannelID).then(res => {
          if (res.msg != null && res.msg !== undefined) {
            console.log(res.msg);
          } else {
            const infoList = res.infoList as MemberMuteInfo[];
            infoList.forEach(user => {
              this.memMuteInfoMap.set(user.email, user);
            });
            this.members = new MatTableDataSource(Array.from(this.memMuteInfoMap.values()));
            this.title = 'Members in this channel';
          }
        });
      }
    });

    // Listen for changes in which channel is being viewed TODO @Kai get messages in here!
    this.viewingUpdateSub = this.viewingObs.subscribe((updatedChannelID) => {
      this.currentChannelID = updatedChannelID;
      console.log(`MuteMembers.currentChannelID = ${this.currentChannelID}`);
    });
  }

  ngOnDestroy() {
    this.isHiddenSubsc.unsubscribe();
    this.viewingUpdateSub.unsubscribe();
  }

  setMuteStatus(email: string, tf: string) {
    if (tf === 'true') {
      console.log(`I want to mute ${email}`);
    } else {
      console.log(`I want to unmute ${email}`);
    }
  }

}
