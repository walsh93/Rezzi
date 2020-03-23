import { Component, OnInit } from '@angular/core';
import { RezziService } from 'src/app/rezzi.service';
import { Subject } from 'rxjs';
import { PrivateMessageData, AbbreviatedUser } from 'src/app/classes.model';

@Component({
  selector: 'app-pm-interface',
  templateUrl: './pm-interface.component.html',
  styleUrls: ['./pm-interface.component.css']
})
export class PmInterfaceComponent implements OnInit {
  session: any;
  abbrevUser: AbbreviatedUser;

  // Passing channels and session to child component channel-messages every time they update
  sessionUpdateSubject: Subject<any> = new Subject<any>();
  pmUsersUpdateSubject: Subject<PrivateMessageData[]> = new Subject<PrivateMessageData[]>();
  viewingUpdateSubject: Subject<string> = new Subject<string>();
  abbrevUserUpdateSubject: Subject<AbbreviatedUser> = new Subject<AbbreviatedUser>();


  constructor(private rezziService: RezziService) { }

  ngOnInit() {
    this.rezziService.getSession().then((session) => {
      this.session = session;
      this.sessionUpdateSubject.next(session);
      if (this.session.email != null && this.session.email !== undefined) {
        this.rezziService.getUserProfile().then((response) => {
          this.abbrevUser = new AbbreviatedUser(response.user.email, response.user.firstName,
            response.user.lastName, response.user.nickName);
          this.abbrevUserUpdateSubject.next(this.abbrevUser);
        });
      }
    });

  }

  receivedPMUsers(pmUsers: PrivateMessageData[]) {
    this.pmUsersUpdateSubject.next(pmUsers);
  }

  viewingNewPMUser(userID: string) {
    this.viewingUpdateSubject.next(userID);
  }
}
