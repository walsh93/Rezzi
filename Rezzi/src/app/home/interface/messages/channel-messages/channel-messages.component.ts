import { Component, OnInit, Input } from '@angular/core';

import { Message } from '../../../../classes.model';

@Component({
  selector: 'app-channel-messages',
  templateUrl: './channel-messages.component.html',
  styleUrls: ['./channel-messages.component.css']
})
export class ChannelMessagesComponent implements OnInit {
  @Input() messages: Message[] = [];

  constructor() { }

  ngOnInit() {
  }

}
