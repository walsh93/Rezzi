import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Message, PrivateMessageData, AbbreviatedUser } from 'src/app/classes.model';
import { MessagesService } from 'src/app/home/interface/messages/messages.service';

@Component({
  selector: 'app-private-messages',
  templateUrl: './private-messages.component.html',
  styleUrls: ['./private-messages.component.css']
})
export class PrivateMessagesComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  private messagesSub: Subscription;
  private userMap: Map<string, PrivateMessageData>;

  amViewingNewPM = false;
  needToUpdateScroll = false;

  // Abbreviated User data
  user: AbbreviatedUser;
  private userUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('abbrevUserUpdateEvent') userObs: Observable<AbbreviatedUser>;

  // Session data retrieved from interface.component
  session: any;
  private sessionUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('sessionUpdateEvent') sessionObs: Observable<any>;


  // User list retrieved from interface.component
  pmUsers: PrivateMessageData[];
  private pmUserUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('pmUsersUpdateEvent') pmUsersObs: Observable<PrivateMessageData[]>;


  // Current user retrieved from interface.component
  currentPMUser: string;
  private viewingUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('viewingUpdateEvent') viewingObs: Observable<string>;

  constructor(public messagesService: MessagesService) {
    this.session = null;
    this.currentPMUser = null;
    this.pmUsers = [];
    this.userMap = new Map<string, PrivateMessageData>();
  }

  ngOnInit() {

    // Listen for user updates
    this.userUpdateSub = this.userObs.subscribe((updatedUser) => {
      console.log('user has been updated in private-messages.component');
      this.user = updatedUser;
      console.log(this.user);
    });

    // Listen for session updates
    this.sessionUpdateSub = this.sessionObs.subscribe((updatedSession) => {
      console.log('session has been updated in private-messages.component');
      this.session = updatedSession;
    });

    // Listen for user list updates
    this.pmUserUpdateSub = this.pmUsersObs.subscribe((updatedPMUsers) => {
      console.log('private messages have been updated in private-messages.component');
      this.pmUsers = updatedPMUsers;

      updatedPMUsers.forEach((user) => {
        this.userMap.set(user.recipient, user);
      });
    });

    // Listen for changes in which channel is being viewed TODO @Kai/Conley get messages in here!
    this.viewingUpdateSub = this.viewingObs.subscribe((updatedPMUser) => {
      this.currentPMUser = updatedPMUser;
      const dbpath = this.messagesService.createUserPath(this.session.email, updatedPMUser);
      console.log("P-M.component.ts dbpath", dbpath);
      if (dbpath != null && dbpath !== undefined) {
        this.amViewingNewPM = true;
        this.messagesService.getPrivateMessages(dbpath.userPath, dbpath.receiverID);  // EDIT THIS Triggers msg upd listener
        this.messagesService.emitNewUserView(dbpath);  // EDIT THIS eventually triggers addListenerForChannelMessages
      }
    });

    this.messagesSub = this.messagesService.getMessageUpdateListener().subscribe((updatedMessages: Message[]) => { // should be fine
      console.log("message update");
      const diffNumberOfMessages = (this.messages.length !== updatedMessages.length);
      this.needToUpdateScroll = (this.amViewingNewPM || diffNumberOfMessages);
      this.messages = updatedMessages;
      this.amViewingNewPM = false;
    }
    )
  }

  ngOnDestroy(): void {
    this.sessionUpdateSub.unsubscribe();
    this.pmUserUpdateSub.unsubscribe();
    this.viewingUpdateSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }





}
