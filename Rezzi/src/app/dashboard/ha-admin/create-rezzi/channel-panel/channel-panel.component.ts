import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel-panel',
  templateUrl: './channel-panel.component.html',
  styleUrls: ['./channel-panel.component.css']
})
export class ChannelPanelComponent implements OnInit {
  name: string;
  default: boolean;

  constructor() { }

  ngOnInit() {
  }

}
