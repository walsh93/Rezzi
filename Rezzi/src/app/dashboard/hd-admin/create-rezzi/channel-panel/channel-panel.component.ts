import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-channel-panel',
  templateUrl: './channel-panel.component.html',
  styleUrls: ['./channel-panel.component.css']
})
export class ChannelPanelComponent implements OnInit {
  @Input() public channel: { id: number, name: string/*, default: boolean*/ };
  @Output() default_emitter = new EventEmitter<{ id: number, name: string/*, default: boolean*/ }>();
  @Output() delete_emitter = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {

  }

  // onToggleChange(ob: MatSlideToggleChange) {
  // 	this.channel.default = ob.checked;
  // 	this.default_emitter.emit({
  //     id: this.channel.id,
  // 		name: this.channel.name,
  // 		default: this.channel.default
  // 	});
  // }

  onNameChange(event: any) {
    this.channel.name = event;
    this.default_emitter.emit({
      id: this.channel.id,
      name: this.channel.name,
      // default: this.channel.default
    });
  }

  onDelete() {
    this.delete_emitter.emit(this.channel.id);
  }
}
