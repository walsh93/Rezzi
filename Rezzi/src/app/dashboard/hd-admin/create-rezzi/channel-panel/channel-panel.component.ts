import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-channel-panel',
  templateUrl: './channel-panel.component.html',
  styleUrls: ['./channel-panel.component.css']
})
export class ChannelPanelComponent implements OnInit {
  @Input() public name: string;
  @Input() public default: boolean;

  constructor() { }

  ngOnInit() {
  }

}
