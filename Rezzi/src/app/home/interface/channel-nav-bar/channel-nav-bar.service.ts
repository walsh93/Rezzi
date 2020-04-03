import { Injectable, Output, EventEmitter } from '@angular/core';
import { ChannelData } from 'src/app/classes.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ChannelNavBarService {
  channel: ChannelData;

  private channelUpdateStatus = new BehaviorSubject(false);
  currentChannelUpdateStatus = this.channelUpdateStatus.asObservable();

  constructor() {}


  @Output() setChannel: EventEmitter<ChannelData> = new EventEmitter();

  setNavData(channelData: ChannelData) {
    this.channel = channelData;
    this.setChannel.emit(this.channel);
  }

  changeChannelUpdateStatus(status: boolean) {
    this.channelUpdateStatus.next(status);
  }

}
