import { Component, OnInit } from '@angular/core';

import { Message } from '../../classes.model';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  storedMessages: Message[] = [];

  onMessageAdded(message) {
    console.log(message);
    this.storedMessages.push(message);
  }

  constructor() { }

  ngOnInit() {
  }

}
