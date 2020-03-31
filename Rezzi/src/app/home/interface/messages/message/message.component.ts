import { Component, OnInit, Input } from "@angular/core";
import {
  User,
  ReactionData,
  AbbreviatedUser,
  Message,
  SocketChannelMessageData,
  SocketPrivateMessageData
} from "src/app/classes.model";
import { RezziService } from "src/app/rezzi.service";
import { MessagesService } from "../messages.service";

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
  private content: string; // The content of the message (extracted from message)
  private time: Date; // When the message was sent (extracted from message)
  private reported: boolean;

  constructor(public messagesService: MessagesService) {}

  ngOnInit() {
    // console.log(this.time);
    // console.log("Message: ", this.message);
    // console.log(this.viewingUser);
    this.reactions = this.message.reactions;
    this.user = this.message.owner;
    this.content = this.message.content;
    this.time = this.message.time;
    this.reported = this.message.reported;
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

    for (const reaction in this.reactions) {
      // Set initial color values for reactions
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
    console.log("before:" + this.message.reported);
    this.message.reported = true;
    this.reported = true;
    console.log("after: " + this.message.reported);
    if (this.pm) {
      const spmd: SocketPrivateMessageData = {
        message: this.message,
        sender: this.viewingUser.email,
        recipient: this.pmUser
      };
      spmd.message.reported = this.reported;
      this.messagesService.updateMessageThroughSocket(spmd);
    } else {
      const scmd: SocketChannelMessageData = {
        message: this.message,
        rezzi: this.rezzi,
        channelID: this.channel
      };
      scmd.message.reported = this.reported;
      console.log("scmd: " + this.reported);
      this.messagesService.updateMessageThroughSocket(scmd);
    }
    alert('This message has been reported to the hall director!')
  }
}
