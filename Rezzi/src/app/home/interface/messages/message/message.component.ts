import { Component, OnInit, Input, ɵConsole } from '@angular/core';
import {
  User,
  ReactionData,
  AbbreviatedUser,
  Message,
  SocketChannelMessageData,
  SocketPrivateMessageData,
  HDUser,
  EventData,
  PollInfo
} from "src/app/classes.model";
import { RezziService } from "src/app/rezzi.service";
import { MessagesService } from "../messages.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { MatRadioButton, MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from 'src/app/profile/profile.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  // Add properties as needed/implemented
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  monthNames = [
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
  displayTime: string;
  displayPollExpiration: string;
  reacted = {};

  // Properties inherited from channel-messages (or whatever the parent component is)
  @Input() viewingUser: User; // The user viewing the channel (or PM)
  @Input() message: Message; // The actual message data
  @Input() channel: string; // The channel the message is in
  @Input() rezzi: string; // The Rezzi the channel is in
  @Input() pm: boolean; // Whether or not the message is a pm
  @Input() pmUser: string; // The user being PMd
  @Input() updateScrolling: boolean; // Does the scroll depth need to update?

  private reactions: ReactionData; // Data holding the reaction (extracted from message)
  private user: AbbreviatedUser; // The user who sent the message (extracted from message)
  userEmail: string;  // Email of user who sent the message (used for profile lookup)
  private time: Date; // When the message was sent (extracted from message)
  private reported: boolean;
  private theHD: HDUser;
  private hdEmail: string;
  private content: SafeHtml[]; // The content of the message (extracted from message)
  private image: string; // Image from link in message, or webpage preview (extracted from message)
  displayName: string;
  private pmReportId: string; // syntax: userWhoReportedMessage-messageID
  private ReportId: string;
  private currUserEmail: string;
  private avatar: string // The avatar image, extracted from message
  private event: EventData; // The event in the message, if it has one
  private isPoll: boolean;
  private pollInfo: PollInfo;
  private pollTie: boolean;
  pollTieInfo: string[];

  accountType: number;
  pollResponse;
  currentTime: number;
  formSubmissionTime: number;
  pollExpireTime: Date;
  pollWinnerName: string;
  pollWinnerCount: number;
  pollWinnerTotal: number;

  constructor(
    public messagesService: MessagesService,
    private http: HttpClient,
    private rezziService: RezziService,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    public profileDialog: MatDialog
  ) { }

  ngOnInit() {
    this.reactions = this.message.reactions;
    this.user = this.message.owner;
    this.userEmail = this.message.owner.email;
    this.avatar = this.message.owner.image_url;
    this.time = this.message.time;
    this.reported = this.message.reported;
    this.image = this.message.image;
    this.event = this.message.event;
    this.content = [];
    this.isPoll = this.message.isPoll;
    this.pollInfo = this.message.pollInfo;
    this.pollTieInfo = [];
    if (this.message.content === null && this.message.isPoll == false) {
      this.content.push(null);
    } else if (this.message.content.includes('=====================')) {
      this.message.content.split('=====================').forEach(section => {
        this.content.push(this.sanitizer.bypassSecurityTrustHtml(section));
      });
    } else {
      this.content.push(
        this.sanitizer.bypassSecurityTrustHtml(this.message.content)
      );
    }
    const dateAgain = new Date(this.time);
    const day = this.dayNames[dateAgain.getDay()];
    const month = this.monthNames[dateAgain.getMonth()];
    const date = dateAgain.getDate();
    const hr = dateAgain.getHours();
    const hours = hr > 12 ? `${hr - 12}` : `${hr}`;
    const min = dateAgain.getMinutes();
    const minutes = min < 10 ? `0${min}` : `${min}`;
    const apm = hr > 11 ? 'PM' : 'AM';
    this.displayTime = `${day}, ${month} ${date} at ${hours}:${minutes} ${apm}`;
    this.currentTime = new Date().getTime();
    this.formSubmissionTime = new Date(this.message.time).getTime(); // .getTime();
    this.pollExpireTime = new Date(this.message.time);
    this.pollExpireTime.setDate(this.pollExpireTime.getDate() + 1);
    const day2 = this.dayNames[this.pollExpireTime.getDay()];
    const month2 = this.monthNames[this.pollExpireTime.getMonth()];
    const date2 = this.pollExpireTime.getDate();
    const hr2 = this.pollExpireTime.getHours();
    const hours2 = hr2 > 12 ? `${hr2 - 12}` : `${hr2}`;
    const min2 = this.pollExpireTime.getMinutes();
    const minutes2 = min2 < 10 ? `0${min2}` : `${min2}`;
    const apm2 = hr > 11 ? 'PM' : 'AM';
    this.displayPollExpiration = `${day2}, ${month2} ${date2} at ${hours2}:${minutes2} ${apm2}`;
    if (this.isPoll == true && (this.currentTime - this.formSubmissionTime > 86400000)) {
      let tempcount = 0;
      this.pollWinnerTotal = 0;
      this.message.pollInfo.responses.forEach(element => {
        if (element.count >= tempcount){
          if(element.count==tempcount){
            //push into array
            this.pollTieInfo.push(element.content);
          }
          else{
            //clear array
            this.pollTieInfo.length = 0;
            this.pollTieInfo.push(element.content);
          }
          tempcount = element.count
          this.pollWinnerName = element.content;
          this.pollWinnerCount = element.count;
        }
        this.pollWinnerTotal += element.count;
      });
      if (this.pollWinnerTotal == 0) {
        this.pollWinnerName = "Nothing";
        this.pollWinnerCount = 0;
      }
    }
    if (
      this.user.nickName == null ||
      this.user.nickName === undefined ||
      this.user.nickName.length === 0
    ) {
      this.displayName = `${this.user.firstName} ${this.user.lastName.charAt(
        0
      )}.`;
    } else {
      this.displayName = this.user.nickName;
    }

    // Set initial color values for reactions
    for (const reaction in this.reactions) {
      if (this.reactions.hasOwnProperty(reaction)) {
        if (this.reactions[reaction].includes(this.viewingUser.email)) {
          this.reacted[reaction] = 'accent';
        } else {
          this.reacted[reaction] = '';
        }
      }
    }

    /**
     * Auto scroll to bottom of channel messages (.scrollTop = how much currently scrolled, .scrollHeight = total height)
     * This will execute for every single message being shown every time, but usually happens fast enough that it is not
     * noticable to the user...
     */
    if (this.updateScrolling) {
      const chanMsgs = document.getElementById('channelMessages');
      if (chanMsgs != null) {
        chanMsgs.scrollTop = chanMsgs.scrollHeight;
      } else {
        const pmMsgs = document.getElementById('privateUserMessages');
        pmMsgs.scrollTop = pmMsgs.scrollHeight;
      }
    }

    this.rezziService.getHDEmail().then(response => {
      this.hdEmail = response.hd;
    });

    this.rezziService.getUserProfile().then(response => {
      this.currUserEmail = response.user.email;
    });

    this.rezziService.getSession().then(session => {
      this.accountType = session.accountType;
    })
  }

  sendReaction(reaction) {
    if (this.reacted[reaction] === '') {
      // If the user has not reacted
      this.reacted[reaction] = 'accent';
      this.reactions[reaction].push(this.viewingUser.email);
    } else {
      this.reacted[reaction] = '';
      this.reactions[reaction].splice(
        this.reactions[reaction].indexOf(this.viewingUser.email),
        1
      );
    }

    if (this.pm) {
      const spmd: SocketPrivateMessageData = {
        message: this.message,
        sender: this.viewingUser.email,
        recipient: this.pmUser
      };
      spmd.message.reactions = this.reactions;
      this.messagesService.updateMessageThroughSocket(spmd);

      //send notification
      const body = {
        message: this.viewingUser.email + " reacted to your message",
        channel: this.viewingUser.email,
        recipients: [this.pmUser],
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

    } else {
      const scmd: SocketChannelMessageData = {
        message: this.message,
        rezzi: this.rezzi,
        channelID: this.channel
      };
      scmd.message.reactions = this.reactions;
      this.messagesService.updateMessageThroughSocket(scmd);

      //send notificaiton
      const body = {
        message: this.viewingUser.firstName + " reacted to your message",
        channel: this.channel,
        recipients: [this.message.owner.email],
      }
      console.log("viewing user first name: ", this.message.owner.firstName)
  
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
    }
  }

  getList(reaction) {
    return this.reactions[reaction].join('\n');
  }

  reportMessage() {
    if (this.accountType < 2) {
      var retVal = confirm("Are you sure you want to remove this message? This cannot be undone");
      if(retVal!=true){ // retVal != true if they hit cancel.
        return;
      }
      if (this.pm) {
        const spmd: SocketPrivateMessageData = {
          message: this.message,
          sender: this.viewingUser.email,
          recipient: this.pmUser
        };
        spmd.message.visible = false;
        this.messagesService.updateMessageThroughSocket(spmd);
      } else {
        const scmd: SocketChannelMessageData = {
          message: this.message,
          rezzi: this.rezzi,
          channelID: this.channel
        };
        scmd.message.visible = false;
        this.messagesService.updateMessageThroughSocket(scmd);
      }
      alert("The message has been removed.");
    }
    else {
      if(this.message.reported){
        alert("This message has already been reported!");
        return;
      }
      var retVal = confirm("Are you sure you want to report this message? This cannot be undone");
      if(retVal!=true){
        return;
      }
      this.message.reported = true;
      this.reported = true;
      if (this.pm) {
        const spmd: SocketPrivateMessageData = {
          message: this.message,
          sender: this.viewingUser.email,
          recipient: this.pmUser
        };
        spmd.message.reported = this.reported;
        this.messagesService.updateMessageThroughSocket(spmd);
        this.pmReportId = this.currUserEmail.concat('-').concat(this.message.id);
        this.ReportId = this.pmReportId;
      } else {
        const scmd: SocketChannelMessageData = {
          message: this.message,
          rezzi: this.rezzi,
          channelID: this.channel
        };
        scmd.message.reported = this.reported;
        this.messagesService.updateMessageThroughSocket(scmd);
        this.ReportId = this.message.id;
      }
      alert('This message has been reported to the hall director!');
      this.updateHallDirector(this.hdEmail, this.user.email);
    }
  }

  respondToEvent(response) {
    this.messagesService.respondToEvent(this.viewingUser, this.event, response).subscribe(resp => {

    },
    error => {
      // event is probably canceled
      this._snackBar.open('Event is canceled', 'Dismiss', {
        duration: 2000,
      });
    });
  }

  updateHallDirector(hd, user) {
    this.rezziService.findUserByEmail(hd, user).then(response => {
      this.theHD = new HDUser(
        response.hd.firstName,
        response.hd.lastName,
        response.hd.email,
        response.hd.password,
        response.hd.verified,
        response.hd.deletionRequests,
        response.hd.reportedMessages
      );
      if (this.theHD.reportedMessages === undefined) {
        this.theHD.reportedMessages = [];
      }
      if (this.theHD.reportedMessages.includes(this.ReportId)) {
      } else {
        this.theHD.reportedMessages.push(this.ReportId);
      }
    });

    this.updateHD(hd, this.ReportId);
  }
  updateHD(hd, msg) {

    this.http
      .post<{ notification: string }>(
        `http://localhost:4100/home/api/update-hd-rpt?hd=${hd}&msg=${msg}`,
        hd
      )
      .subscribe(responseData => {
        console.log(responseData.notification);
      });
  }

  //  formSubmissionTime = new Date(this.message.time).getTime();

  formResponse(index) {
    this.currentTime = new Date().getTime();
    if (this.currentTime - this.formSubmissionTime > 86400000) {
      alert("Form has expired!");
      return;
    }
    this.message.pollInfo.users.push(this.user.email);
    this.message.pollInfo.responses[this.pollResponse].count++;
    const scmd: SocketChannelMessageData = {
      message: this.message,
      rezzi: this.rezzi,
      channelID: this.channel
    };
    this.messagesService.updateMessageThroughSocket(scmd);
  }

  openProfileDialog(profile: string) { // TODO pop up profile dialog
    console.log('profile dialog', profile);
    const profileDialogRef = this.profileDialog.open(ProfileComponent, {
      height: 'auto',
      width: '500px',
      data: {
        p: profile,
      }
    });
  }
}
