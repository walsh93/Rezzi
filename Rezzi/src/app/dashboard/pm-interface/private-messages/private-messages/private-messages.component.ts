import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Message, PrivateMessageData } from 'src/app/classes.model';
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

  // Session data retrieved from interface.component
  session: any;
  private sessionUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('sessionUpdateEvent') sessionObs: Observable<any>;


  // User list retrieved from interface.component
  users: PrivateMessageData[];
  private userUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('usersUpdateEvent') usersObs: Observable<PrivateMessageData[]>;


  // Current user retrieved from interface.component
  currentUser: string;
  private viewingUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('viewingUpdateEvent') viewingObs: Observable<string>;

  constructor(public messagesService: MessagesService) {
    this.session = null;
    this.currentUser = null;
    this.users = [];
    this.userMap = new Map<string, PrivateMessageData>();
  }

  ngOnInit() {
    // Listen for session updates
    this.sessionUpdateSub = this.sessionObs.subscribe((updatedSession) => {
      console.log('session has been updated in channel-messages.component');
      this.session = updatedSession;
    });

    // Listen for user list updates
    this.userUpdateSub = this.usersObs.subscribe((updatedUsers) => {
      console.log('channels have been updated');
      this.users = updatedUsers;

      updatedUsers.forEach((user) => {
        this.userMap.set(user.recipient, user);
      });
    });

    // Listen for changes in which channel is being viewed TODO @Kai get messages in here!
    this.viewingUpdateSub = this.viewingObs.subscribe((updatedUserID) => {
      this.currentUser = updatedUserID;
      const dbpath = this.messagesService.createUserPath(this.session.email, updatedUserID);
      if (dbpath != null && dbpath !== undefined) {
        this.messagesService.getChannelMessages(dbpath.userPath, dbpath.receiverID);  // Triggers msg upd listener
        this.messagesService.emitNewUserView(dbpath);  // eventually triggers addListenerForChannelMessages
      }
    });
  }

  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }





}
