import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Message, SocketChannelMessageData, NodeSession, AbbreviatedUserProfile } from '../../../../classes.model';
import { MessagesService } from '../messages.service';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InterfaceService } from '../../interface.service';
import { ChannelNavBarService } from '../../channel-nav-bar/channel-nav-bar.service';
import * as c from '../../interface.constants';

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
  private isMuted: boolean;
  private isMutedSubsc: Subscription;

  // Viewing data
  isHidden = false;  // By default, want to show channel messages and new-message component
  private viewingChanMsg = true;
  private interfaceViewSubsc: Subscription;
  private currentChannelID: string;
  private newChannelViewSubsc: Subscription;  // Listen for changes in which channel is being viewed

  // Message UI data
  enteredMessage = '';
  image = null;

  constructor(private cnbSrv: ChannelNavBarService, public messageSrv: MessagesService, private interfaceSrv: InterfaceService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.initializeNodeSession();
    this.initializeAbbreviatedUserProfile();
    this.initializeAbilityToPost();
    this.initializeInterfaceViewListener();
    this.initializeChannelViewListener();
  }

  private initializeNodeSession() {
    this.nodeSession = this.interfaceSrv.getNodeSession();
    this.nodeSessionSubsc = this.interfaceSrv.getNodeSessionListener().subscribe(session => {
      this.nodeSession = session;
    });
  }

  private initializeAbbreviatedUserProfile() {
    this.userProfileAbr = this.interfaceSrv.getAbbreviatedUserProfile();
    this.userProfileAbrSubsc = this.interfaceSrv.getAbbreviatedUserProfileListener().subscribe(userAbr => {
      this.userProfileAbr = userAbr;
    });
  }

  private initializeAbilityToPost() {
    this.canPost = this.interfaceSrv.getCanPost();
    this.canPostSubsc = this.interfaceSrv.getCanPostListener().subscribe(canPostNow => {
      this.canPost = canPostNow;
      this.updateMsgBarVisibility();
    });
    this.isMutedSubsc = this.interfaceSrv.getIsMutedListener().subscribe(isMutedNow => {
      this.isMuted = isMutedNow;
      this.updateMsgBarVisibility();
    });
  }

  private initializeInterfaceViewListener() {
    this.interfaceViewSubsc = this.cnbSrv.getInterfaceViewListener().subscribe(newView => {
      this.viewingChanMsg = (newView === c.VIEW_CHANNEL_MESSAGES);
      this.updateMsgBarVisibility();
    });
  }

  private initializeChannelViewListener() {
    this.newChannelViewSubsc = this.interfaceSrv.getNewChannelViewListener().subscribe(newChannelViewID => {
      this.currentChannelID = newChannelViewID;
    });
  }

  private updateMsgBarVisibility() {
    if (this.canPost && !this.isMuted && this.viewingChanMsg) {
      this.isHidden = false;
    } else {
      this.isHidden = true;
    }
  }

  onAddMessage(form: NgForm) {
    if (form.invalid) {
      return;
    }
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
    this.messageSrv.sendMessageThroughSocket(scmd);
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
    this.interfaceViewSubsc.unsubscribe();
    this.newChannelViewSubsc.unsubscribe();
  }

}
