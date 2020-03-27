import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../rezzi.service';
import { ChannelData, User, AbbreviatedUser } from '../../classes.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  session: any;
  resHall: string;
  user: User;
  abbrevUser: AbbreviatedUser;

  // Passing channels and session to child component channel-messages every time they update
  sessionUpdateSubject: Subject<any> = new Subject<any>();
  abbrevUserUpdateSubject: Subject<AbbreviatedUser> = new Subject<AbbreviatedUser>();
  channelsUpdateSubject: Subject<ChannelData[]> = new Subject<ChannelData[]>();
  viewingUpdateSubject: Subject<string> = new Subject<string>();

  constructor(private rezziService: RezziService) { }

  ngOnInit() {
    this.rezziService.getSession().then((session) => {
      this.session = session;
      this.sessionUpdateSubject.next(session);
      this.resHall = this.session.rezzi;
      this.rezziService.getUserProfile().then(response => {
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
        );
      });

      if (this.session.email != null && this.session.email !== undefined) {
        this.rezziService.getUserProfile().then((response) => {
          this.abbrevUser = new AbbreviatedUser(response.user.email, response.user.firstName,
            response.user.lastName, response.user.nickName);
          this.abbrevUserUpdateSubject.next(this.abbrevUser);

          if (this.resHall == null || this.resHall === undefined) {
            this.resHall = response.user.rezzi;
          }
        });
      }
    });
  }

  receivedChannels(channels: ChannelData[]) {
    this.channelsUpdateSubject.next(channels);
  }

  viewingNewChannel(channelID: string) {
    this.viewingUpdateSubject.next(channelID);
  }

}
