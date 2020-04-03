import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bot-message',
  templateUrl: './bot-message.component.html',
  styleUrls: ['./bot-message.component.css']
})
export class BotMessageComponent implements OnInit {

  @Input() botMessage: string;
  @Input() isLastMsg: boolean;  // Is this the last message?

  // Data to send to channel-messages.component
  @Output() lastMessageDisplayed = new EventEmitter<boolean>();

  constructor() { }

  /**
   * Auto scroll to bottom of channel messages (.scrollTop = how much currently scrolled, .scrollHeight = total height)
   * This will execute for every single message being shown every time, but usually happens fast enough that it is not
   * noticable to the user...
   */
  ngOnInit() {
    console.log('Need scrolling update...');
    const chanMsgs = document.getElementById('channelMessages');
    if (chanMsgs != null) {
      chanMsgs.scrollTop = chanMsgs.scrollHeight;
    } else {
      const pmMsgs = document.getElementById('privateUserMessages');
      pmMsgs.scrollTop = pmMsgs.scrollHeight;
    }

    // Propogate back to parent to reset the scrolling and viewing vars to `false`
    if (this.isLastMsg) {
      this.lastMessageDisplayed.emit(true);
    }
  }

}
