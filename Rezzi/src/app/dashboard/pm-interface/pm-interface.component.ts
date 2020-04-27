import { Component, OnInit, Input } from '@angular/core';
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
  currentName;
  @Input() viewing: string;
  viewingOutput: string;
  // Passing channels and session to child component channel-messages every time they update
  sessionUpdateSubject: Subject<any> = new Subject<any>();
  abbrevUserUpdateSubject: Subject<AbbreviatedUser> = new Subject<AbbreviatedUser>();
  pmUsersUpdateSubject: Subject<PrivateMessageData[]> = new Subject<PrivateMessageData[]>();
  viewingUpdateSubject: Subject<string> = new Subject<string>();


  constructor(private rezziService: RezziService) { }

  ngOnInit() {
    this.viewingOutput = null;
    this.currentName = null;
    this.rezziService.getSession().then((session) => {
      this.session = session;
      this.sessionUpdateSubject.next(session);
      if (this.session.email != null && this.session.email !== undefined) {
        this.rezziService.getUserProfile().then((response) => {
          this.abbrevUser = new AbbreviatedUser(response.user.email, response.user.firstName,
            response.user.lastName, response.user.nickName, response.user.image_url);
          this.abbrevUserUpdateSubject.next(this.abbrevUser);
          if(this.viewing!=null){
            this.viewingOutput = this.viewing;
            this.viewingNewPMUser(this.viewing);
            document.getElementById(this.viewing).style.background = "#607d8b"

          }
        });
      }
    });
  }

  receivedPMUsers(pmUsers: PrivateMessageData[]) {
    this.pmUsersUpdateSubject.next(pmUsers);
  }

  viewingNewPMUser(userID: string) {
    this.rezziService.getProfile(userID).then(userProfile => {
      this.viewingUpdateSubject.next(userID);

      if (
        userProfile.user.nickName == null ||
        userProfile.user.nickName === undefined ||
        userProfile.user.nickName.length === 0
      ) {
        this.currentName = `${userProfile.user.firstName} ${userProfile.user.lastName.charAt(
          0
        )}.`;
      } else {
        this.currentName = userProfile.user.nickName;
      }
    }
      )
    //this.viewingUpdateSubject.next(userID);
  }
}
