import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-floor-drawer',
  templateUrl: './floor-drawer.component.html',
  styleUrls: ['./floor-drawer.component.css']
})
export class FloorDrawerComponent implements OnInit {
  @Input() public floor: { id: number, name: string, channels: { id: number, name: string/*, default: boolean*/ }[] };
  @Output() delete_emitter = new EventEmitter<number>();
  private empty_ids: number[];

  constructor() {
    this.empty_ids = [];
  }

  ngOnInit() {
  }

  addChannel() {
    var temp_id = this.floor.channels.length;
    if (this.empty_ids.length > 0) {
      temp_id = this.empty_ids.pop();
    }
    this.floor.channels.push({
      id: temp_id,
      name: "Example Channel Name",
      // default: true
    })
  }

  deleteChannel(channel_id: number) {
    var index = this.floor.channels.findIndex((channel) => {
      return channel.id === channel_id;
    });
    this.floor.channels.splice(index, 1);
    this.empty_ids.push(channel_id);
  }

  onChange(changed_channel: { id: number, name: string/*, default: boolean*/ }) {
    var index = this.floor.channels.findIndex((channel) => {
      return channel.id === changed_channel.id;
    });
    this.floor.channels[index] = changed_channel;
  }

  onNameChange(event: any) {
    this.floor.name = event;
  }

  deleteFloor() {
    this.delete_emitter.emit(this.floor.id);
  }
}
