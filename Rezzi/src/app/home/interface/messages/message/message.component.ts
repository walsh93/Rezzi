import { Component, OnInit, Input } from "@angular/core";
import {
  User,
  ReactionData,
  AbbreviatedUser,
  Message,
  SocketChannelMessageData,
  SocketPrivateMessageData,
  HDUser,
  EventData
} from "src/app/classes.model";
import { RezziService } from "src/app/rezzi.service";
import { MessagesService } from "../messages.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.css"]
})
export class MessageComponent implements OnInit {
  // Add properties as needed/implemented
  dayNames = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  monthNames = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec."
  ];
  displayTime: string;
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
  private time: Date; // When the message was sent (extracted from message)
  private reported: boolean;
  private theHD: HDUser;
  private hdEmail: string;
  private content: SafeHtml[]; // The content of the message (extracted from message)
  private image: string; // Image from link in message, or webpage preview (extracted from message)
  displayName: string;
  private pmReportId: string; //syntax: userWhoReportedMessage-messageID
  private ReportId: string;
  private currUserEmail: string;
  private avatar: string // The avatar image, extracted from message
  private event: EventData; // The event in the message, if it has one

  constructor(
    public messagesService: MessagesService,
    private http: HttpClient,
    private rezziService: RezziService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // console.log(this.time);
    // console.log("Message: ", this.message);
    this.reactions = this.message.reactions;
    this.user = this.message.owner;
    this.avatar = this.message.owner.image_url;
    this.time = this.message.time;
    this.reported = this.message.reported;
    this.image = this.message.image;
    this.event = this.message.event;
    this.content = [];
    if (this.message.content === null) {
      this.content.push(null);
    } else if (this.message.content.includes("=====================")) {
      this.message.content.split("=====================").forEach(section => {
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
    const apm = hr > 11 ? "PM" : "AM";
    this.displayTime = `${day}, ${month} ${date} at ${hours}:${minutes} ${apm}`;
    // console.log(this.displayTime);
    // this.displayTime = String(dateAgain);

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
          this.reacted[reaction] = "accent";
        } else {
          this.reacted[reaction] = "";
        }
      }
    }

    /**
     * Auto scroll to bottom of channel messages (.scrollTop = how much currently scrolled, .scrollHeight = total height)
     * This will execute for every single message being shown every time, but usually happens fast enough that it is not
     * noticable to the user...
     */
    if (this.updateScrolling) {
      console.log("Need scrolling update...");
      const chanMsgs = document.getElementById("channelMessages");
      if (chanMsgs != null) {
        chanMsgs.scrollTop = chanMsgs.scrollHeight;
      } else {
        const pmMsgs = document.getElementById("privateUserMessages");
        pmMsgs.scrollTop = pmMsgs.scrollHeight;
      }
    }

    this.rezziService.getHDEmail().then(response => {
      this.hdEmail = response.hd;
    });

    this.rezziService.getUserProfile().then(response => {
      this.currUserEmail = response.user.email;
    });
  }

  sendReaction(reaction) {
    if (this.reacted[reaction] === "") {
      // If the user has not reacted
      this.reacted[reaction] = "accent";
      this.reactions[reaction].push(this.viewingUser.email);
    } else {
      this.reacted[reaction] = "";
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
    } else {
      const scmd: SocketChannelMessageData = {
        message: this.message,
        rezzi: this.rezzi,
        channelID: this.channel
      };
      scmd.message.reactions = this.reactions;
      this.messagesService.updateMessageThroughSocket(scmd);
    }
  }

  getList(reaction) {
    return this.reactions[reaction].join("\n");
  }

  reportMessage() {
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
      this.pmReportId = this.currUserEmail.concat("-").concat(this.message.id);
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
    alert("This message has been reported to the hall director!");
    this.updateHallDirector(this.hdEmail, this.user.email);
  }

  respondToEvent(response) {
    this.messagesService.respondToEvent(this.viewingUser, this.event, response);
  }

  updateHallDirector(hd, user) {
    // console.log("updatehd"+ hd);
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
}
