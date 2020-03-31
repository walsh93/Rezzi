import { Injectable, Output, EventEmitter } from '@angular/core';
import { ChannelData } from 'src/app/classes.model';

@Injectable()
export class ChannelNavBarService {
  constructor() {}

  channel: ChannelData;

  @Output() setChannel: EventEmitter<ChannelData> = new EventEmitter();

  setNavData(channelData: ChannelData) {
    this.channel = channelData;
    this.setChannel.emit(this.channel);
  }

}
