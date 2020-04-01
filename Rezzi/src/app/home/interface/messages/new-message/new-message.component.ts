import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Message, User, SocketChannelMessageData, AbbreviatedUser, ReactionData } from '../../../../classes.model';
import { MessagesService } from '../messages.service';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  tempuser = new User('a@a.com', 'abc123', 'Conley', 'Utz', 21, 'CS', 'Con', 'Hi I\'m Conley', true, 0,"");
  enteredMessage = '';

  // Session data
  session: any;
  private sessionUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('sessionUpdateEventAnm') sessionObs: Observable<any>;


  // Abbreviated User data
  user: AbbreviatedUser;
  private userUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('abbrevUserUpdateEvent') userObs: Observable<AbbreviatedUser>;


  // Current channel data
  currentChannel: string;
  private viewingUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('viewingUpdateEventAnm') viewingObs: Observable<string>;

  constructor(public messagesService: MessagesService) { }

  ngOnInit() {
    // Listen for session updates
    this.sessionUpdateSub = this.sessionObs.subscribe((updatedSession) => {
      console.log('session has been updated in new-message.component');
      this.session = updatedSession;
    });

    // Listen for user updates
    this.userUpdateSub = this.userObs.subscribe((updatedUser) => {
      console.log('user has been updated in new-message.component');
      this.user = updatedUser;
      console.log(this.user);
    });

    // Listen for changes in which channel is being viewed
    this.viewingUpdateSub = this.viewingObs.subscribe((updatedChannelID) => {
      console.log(`Now viewing channel ${updatedChannelID}`);
      this.currentChannel = updatedChannelID;
    });
  }

  onAddMessage(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(this.session);
    let message: Message = {
      content: form.value.enteredMessage,
      owner: this.user,
      time: new Date(),
      visible: true,
      id: null, // TODO Need to change the ID
      reactions: { // TODO should make this more generic for ReactionData so its easier to add icons
        thumb_up: [],
        thumb_down: [],
        sentiment_very_satisfied: [],
        sentiment_dissatisfied: [],
        whatshot: [],
      },
      image: null,
    };

    const scmd: SocketChannelMessageData = {
      message,
      rezzi: this.session.rezzi,
      channelID: this.currentChannel,
    };

    // this.messagesService.addMessage(message);
    this.messagesService.sendMessageThroughSocket(scmd);
    form.resetForm();
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
    this.userUpdateSub.unsubscribe();
    this.viewingUpdateSub.unsubscribe();
  }

}
