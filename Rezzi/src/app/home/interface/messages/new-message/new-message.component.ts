import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Message, SocketChannelMessageData, NodeSession, AbbreviatedUserProfile } from '../../../../classes.model';
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
  private canPost: boolean;
  private canPostSubsc: Subscription;
  private isMutedSubsc: Subscription;

  // Viewing data
  private currentChannelID: string;
  private newChannelViewSubsc: Subscription;  // Listen for changes in which channel is being viewed






  enteredMessage = '';
  image = null;

  isHidden = false;  // By default, want to show channel messages and new-message component
  private isHiddenSubsc: Subscription;
  @Input() isHiddenObs: Observable<boolean>;

  constructor(public messagesService: MessagesService, private interfaceService: InterfaceService, public dialog: MatDialog) { }

  ngOnInit() {
    this.initializeNodeSession();
    this.initializeAbbreviatedUserProfile();
    this.initializeAbilityToPost();
    this.initializeChannelViewListener();



    // Listen for whether or not to view this in the interface or some other component
    this.isHiddenSubsc = this.isHiddenObs.subscribe((viewNow) => {
      this.isHidden = !viewNow;
    });
  }

  private initializeNodeSession() {
    this.nodeSession = this.interfaceService.getNodeSession();
    this.nodeSessionSubsc = this.interfaceService.getNodeSessionListener().subscribe(session => {
      this.nodeSession = session;
    });
  }

  private initializeAbbreviatedUserProfile() {
    this.userProfileAbr = this.interfaceService.getAbbreviatedUserProfile();
    this.userProfileAbrSubsc = this.interfaceService.getAbbreviatedUserProfileListener().subscribe(userAbr => {
      this.userProfileAbr = userAbr;
    });
  }

  private initializeAbilityToPost() {
    this.canPost = this.interfaceService.getCanPost();
    this.canPostSubsc = this.interfaceService.getCanPostListener().subscribe(canPostNow => {
      this.canPost = canPostNow;
    });
    this.isMutedSubsc = this.interfaceService.getIsMutedListener().subscribe(isMutedNow => {
      if (this.canPost) {
        this.isHidden = isMutedNow;
      }
    });
  }

  private initializeChannelViewListener() {
    this.newChannelViewSubsc = this.interfaceService.getNewChannelViewListener().subscribe(newChannelViewID => {
      console.log(`Now viewing channel ${newChannelViewID}`);
      this.currentChannelID = newChannelViewID;
    });
  }

  onAddMessage(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(this.userProfileAbr);
    const message: Message = {
      content: form.value.enteredMessage,
      owner: this.userProfileAbr,
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
      rezzi: this.nodeSession.rezzi,
      channelID: this.currentChannelID,
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
    this.nodeSessionSubsc.unsubscribe();
    this.userProfileAbrSubsc.unsubscribe();
    this.canPostSubsc.unsubscribe();
    this.isMutedSubsc.unsubscribe();
    this.newChannelViewSubsc.unsubscribe();



    this.isHiddenSubsc.unsubscribe();
  }

}
