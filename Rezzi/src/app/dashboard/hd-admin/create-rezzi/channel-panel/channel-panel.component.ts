import { Component, OnInit, Input } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

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

  onChange(ob: MatSlideToggleChange) {
  	this.default = ob.checked;
  }
}
