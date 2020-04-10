import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Message, User, SocketChannelMessageData, AbbreviatedUser, ReactionData, NodeSession, AbbreviatedUserProfile } from '../../../../classes.model';
import { MessagesService } from '../messages.service';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { InterfaceService } from '../../interface.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit, OnDestroy {
  // Node session data
  private nodeSession: NodeSession;
  private nodeSessionSubsc: Subscription;

  // User profile data
  private userProfileAbr: AbbreviatedUserProfile;
  private userProfileAbrSubsc: Subscription;




  tempuser = new User('a@a.com', 'abc123', 'Conley', 'Utz', 21, 'CS', 'Con', 'Hi I\'m Conley', true, 0, '');
  enteredMessage = '';
  image = null;

  isHidden = false;  // By default, want to show channel messages and new-message component
  private isHiddenSubsc: Subscription;
  @Input() isHiddenObs: Observable<boolean>;

  private canPost = true;
  private canPostUpdateSub: Subscription;
  // tslint:disable-next-line: no-input-rename
  @Input('canPostUpdateEvent') canPostObs: Observable<boolean>;
  private isMutedSubsc: Subscription;
  @Input() isMutedObs: Observable<boolean>;

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

  constructor(public messagesService: MessagesService, private interfaceService: InterfaceService, public dialog: MatDialog) { }

  ngOnInit() {
    this.initializeComponentData();

    // Listen for whether or not to view this in the interface or some other component
    this.isHiddenSubsc = this.isHiddenObs.subscribe((viewNow) => {
      this.isHidden = !viewNow;
    });

    // Listen for whether or not the user is muted
    this.canPostUpdateSub = this.canPostObs.subscribe((canPost) => {
      this.canPost = canPost;
    });
    this.isMutedSubsc = this.isMutedObs.subscribe(isMuted => {
      if (this.canPost) {
        this.isHidden = isMuted;
      }
    });

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

  private initializeComponentData() {
    // Initialize session
    const session1 = this.interfaceService.getNodeSession();
    if (session1 == null) {
      this.nodeSessionSubsc = this.interfaceService.getNodeSessionListener().subscribe(session2 => {
        this.nodeSession = session2;
      });
    } else {
      this.nodeSession = session1;
    }

    // Initialize abbreviated user profile
    const userAbr1 = this.interfaceService.getAbbreviatedUserProfile();
    if (userAbr1 == null) {
      this.userProfileAbrSubsc = this.interfaceService.getAbbreviatedUserProfileListener().subscribe(userAbr2 => {
        this.userProfileAbr = userAbr2;
      });
    } else {
      this.userProfileAbr = userAbr1;
    }
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
      id: null, // TODO Need to change the ID
      reactions: { // TODO should make this more generic for ReactionData so its easier to add icons
        thumb_up: [],
        thumb_down: [],
        sentiment_very_satisfied: [],
        sentiment_dissatisfied: [],
        whatshot: [],
      },
      reported: false,
      image: (this.image !== null ? this.image.src : null),
    };

    const scmd: SocketChannelMessageData = {
      message,
      rezzi: this.session.rezzi,
      channelID: this.currentChannel,
    };

    // this.messagesService.addMessage(message);
    this.messagesService.sendMessageThroughSocket(scmd);
    this.image = null;
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
    if (this.nodeSessionSubsc != null) {
      this.nodeSessionSubsc.unsubscribe();
    }
    if (this.userProfileAbrSubsc != null) {
      this.userProfileAbrSubsc.unsubscribe();
    }
    this.isHiddenSubsc.unsubscribe();
    this.isMutedSubsc.unsubscribe();
    this.canPostUpdateSub.unsubscribe();
    this.sessionUpdateSub.unsubscribe();
    this.userUpdateSub.unsubscribe();
    this.viewingUpdateSub.unsubscribe();
  }

}
