import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { MessagesService } from 'src/app/home/interface/messages/messages.service';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Message, SocketPrivateMessageData, AbbreviatedUser } from 'src/app/classes.model';
import { ImageModalComponent } from 'src/app/home/interface/messages/new-message/image-modal/image-modal.component';

@Component({
  selector: 'app-new-pm',
  templateUrl: './new-pm.component.html',
  styleUrls: ['./new-pm.component.css']
})
export class NewPmComponent implements OnInit {
  enteredMessage = '';
  image = null;

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
  currentPMUser: string;
  private viewingUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('viewingUpdateEventAnm') viewingObs: Observable<string>;

  constructor(private http: HttpClient, public messagesService: MessagesService, public dialog: MatDialog) { }

  ngOnInit() {
    // Listen for session updates
    this.sessionUpdateSub = this.sessionObs.subscribe((updatedSession) => {
      console.log('session has been updated in new-pm.component');
      this.session = updatedSession;
    });

    // Listen for user updates
    this.userUpdateSub = this.userObs.subscribe((updatedUser) => {
      console.log('user has been updated in new-pm.component');
      this.user = updatedUser;
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
    const message: Message = {
      content: form.value.enteredMessage,
      owner: this.user,
      time: new Date(),
      visible: true,
      id: null,
      reactions: { // TODO should make this more generic for ReactionData so its easier to add icons
        thumb_up: [],
        thumb_down: [],
        sentiment_very_satisfied: [],
        sentiment_dissatisfied: [],
        whatshot: [],
      },
      reported: false,
      image: (this.image !== null ? this.image.src : null),
      isPoll: false,
      pollInfo: null,
    };

    const scmd: SocketPrivateMessageData = {
      message,
      recipient: this.currentPMUser,
      sender: this.session.email
    };

    console.log("new-pm.comp.ts", scmd);
    // this.messagesService.addMessage(message);
    this.messagesService.sendPrivateMessageThroughSocket(scmd);
    this.image = null;

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
   const monthNames = [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'June',
    'July',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.'
  ];
  var displayTime;
    const dateAgain = new Date();
    const day = dayNames[dateAgain.getDay()];
    const month = monthNames[dateAgain.getMonth()];
    const date = dateAgain.getDate();
    const hr = dateAgain.getHours();
    const hours = hr > 12 ? `${hr - 12}` : `${hr}`;
    const min = dateAgain.getMinutes();
    const minutes = min < 10 ? `0${min}` : `${min}`;
    const apm = hr > 11 ? 'PM' : 'AM';
    displayTime = `${day}, ${month} ${date} at ${hours}:${minutes} ${apm}`;

    const body = {
      message: "You have been sent a new private message at " + displayTime,
      channel: this.session.email,
      recipients: [this.currentPMUser],
      isPM: true,
    }

    this.http.post('/send-notifications', body).toPromise().then((response) => {
      
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        alert(res.error.text);  // an alert is blocking, so the subsequent code will only run once alert closed
        location.reload();
      } else {
        console.log(res.error.text)
        alert(`There was an error while trying to send notifications. Please try again later.`);
      }
    });

    form.resetForm();

    
  }

  openImageDialog() {
    const dialogRef = this.dialog.open(ImageModalComponent, {
      width: '600px',
      height: '400px'
    });

    dialogRef.componentInstance.imageRefEmitter.subscribe((image) => {
      this.image = image;
    });
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
    this.viewingUpdateSub.unsubscribe();
    this.userUpdateSub.unsubscribe();
  }

}
