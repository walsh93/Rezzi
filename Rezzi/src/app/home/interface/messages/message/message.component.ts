import { Component, OnInit, Input } from '@angular/core';
import { User, ReactionData } from 'src/app/classes.model';
import { RezziService } from 'src/app/rezzi.service';

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
  @Input() content: string;
  @Input() time: Date;
  @Input() reactions: ReactionData;

  constructor() { }

  ngOnInit() {
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

    console.log("Viewing User", this.viewingUser);
    for (var reaction in this.reactions) {  // Set initial color values
      if (this.reactions.hasOwnProperty(reaction)) {
        if (this.reactions[reaction].includes(this.viewingUser.email)) {
          this.reacted[reaction] = "accent";
        }
        else {
          this.reacted[reaction] = "";
        }
      }
    }
    console.log("REACTED", this.reacted);
  }

  sendReaction(reaction) {
    if (this.reacted[reaction] === "") {  // If the user has not reacted
      console.log("Reacting", reaction);
      this.reacted[reaction] = "accent";
      this.reactions[reaction].push(this.viewingUser.email);
    }
    else {
      console.log("Unreacting", reaction);
      this.reacted[reaction] = "";
      this.reactions[reaction].splice(this.reactions[reaction].indexOf(this.viewingUser.email), 1);
    }
  }

}
