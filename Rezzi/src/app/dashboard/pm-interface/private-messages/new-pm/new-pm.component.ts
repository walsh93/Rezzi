import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { MessagesService } from 'src/app/home/interface/messages/messages.service';
import { NgForm } from '@angular/forms';
import { Message, SocketPrivateMessageData } from 'src/app/classes.model';

@Component({
  selector: 'app-new-pm',
  templateUrl: './new-pm.component.html',
  styleUrls: ['./new-pm.component.css']
})
export class NewPmComponent implements OnInit {
  enteredMessage = '';

  // Session data
  session: any;
  private sessionUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('sessionUpdateEventAnm') sessionObs: Observable<any>;


  // Current channel data
  currentPMUser: string;
  private viewingUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('viewingUpdateEventAnm') viewingObs: Observable<string>;

  constructor(public messagesService: MessagesService) { }

  ngOnInit() {
        // Listen for session updates
        this.sessionUpdateSub = this.sessionObs.subscribe((updatedSession) => {
          console.log('session has been updated in new-pm.component');
          this.session = updatedSession;
        });

        // Listen for changes in which channel is being viewed
        this.viewingUpdateSub = this.viewingObs.subscribe((updatedPMUser) => {
          console.log(`Now viewing user ${updatedPMUser}`);
          this.currentPMUser = updatedPMUser;
        });
  }

  onAddMessage(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(this.session);
    const message: Message = {
      content: form.value.enteredMessage,
      owner: this.session.email,
      time: new Date(),
      visible: true,
      id: null // TODO Need to change the ID
    };

    const scmd: SocketPrivateMessageData = {
      message,
      recipient: this.currentPMUser,
      sender: this.session.email
    };

    console.log("NEW-PM",scmd);
    // this.messagesService.addMessage(message);
    this.messagesService.sendPrivateMessageThroughSocket(scmd);
    form.resetForm();
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
    this.viewingUpdateSub.unsubscribe();
  }

}
