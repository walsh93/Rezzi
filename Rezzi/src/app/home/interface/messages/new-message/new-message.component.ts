import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Message, User, SocketChannelMessageData } from '../../../../classes.model';
import { MessagesService } from '../messages.service';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  tempuser = new User('a@a.com', 'abc123', 'Conley', 'Utz', 21, 'CS', 'Con', 'Hi I\'m Conley', true, 0);
  enteredMessage = '';


  // Session data
  session: any;
  private sessionUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('sessionUpdateEventAnm') sessionObs: Observable<any>;


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
    const message: Message = {
      content: form.value.enteredMessage,
      // owner: this.tempuser,
      time: new Date(),
      visible: true,
      id: null // TODO Need to change the ID
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
    this.viewingUpdateSub.unsubscribe();
  }

}
