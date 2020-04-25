import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bot-message',
  templateUrl: './bot-message.component.html',
  styleUrls: ['./bot-message.component.css']
})
export class BotMessageComponent implements OnInit {

  @Input() botMessage: string;

  constructor() { }

  /**
   * Auto scroll to bottom of channel messages (.scrollTop = how much currently scrolled, .scrollHeight = total height)
   * This will execute for every single message being shown every time, but usually happens fast enough that it is not
   * noticable to the user...
   */
  ngOnInit() {
    const chanMsgs = document.getElementById('channelMessages');
    if (chanMsgs != null) {
      chanMsgs.scrollTop = chanMsgs.scrollHeight;
    } else {
      const pmMsgs = document.getElementById('privateUserMessages');
      pmMsgs.scrollTop = pmMsgs.scrollHeight;
    }
  }

}
