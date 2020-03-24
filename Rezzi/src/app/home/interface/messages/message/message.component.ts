import { Component, OnInit, Input } from '@angular/core';
import { User, ReactionData, AbbreviatedUser, Message, SocketChannelMessageData } from 'src/app/classes.model';
import { RezziService } from 'src/app/rezzi.service';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  // Add properties as needed/implemented
  dayNames = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
  monthNames = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  displayTime: string;
  reacted = {};

  // Properties inherited from channel-messages (or whatever the parent component is)
  @Input() viewingUser: User;
  @Input() message: Message;
  @Input() channel: string;
  @Input() rezzi: string;
  private reactions: ReactionData;
  private user: AbbreviatedUser;
  private content: string;
  private time: Date;

  constructor(public messagesService: MessagesService) {
    this.reactions = this.message.reactions;
    this.user = this.message.owner;
    this.content = this.message.content;
    this.time = this.message.time;
  }

  ngOnInit() {
    //console.log(this.time);
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
    console.log(this.displayTime);
    this.displayTime = String(dateAgain);

    for (var reaction in this.reactions) {  // Set initial color values for reactions
      if (this.reactions.hasOwnProperty(reaction)) {
        if (this.reactions[reaction].includes(this.viewingUser.email)) {
          this.reacted[reaction] = "accent";
        }
        else {
          this.reacted[reaction] = "";
        }
      }
    }
  }

  sendReaction(reaction) {
    let scmd: SocketChannelMessageData = {
      message: this.message,
      rezzi: this.rezzi,
      channelID: this.channel,
    };

    if (this.reacted[reaction] === "") {  // If the user has not reacted
      this.reacted[reaction] = "accent";
      this.reactions[reaction].push(this.viewingUser.email);
    }
    else {
      this.reacted[reaction] = "";
      this.reactions[reaction].splice(this.reactions[reaction].indexOf(this.viewingUser.email), 1);
    }

    scmd.message.reactions = this.reactions;
    this.messagesService.updateMessageThroughSocket(scmd);
  }

}