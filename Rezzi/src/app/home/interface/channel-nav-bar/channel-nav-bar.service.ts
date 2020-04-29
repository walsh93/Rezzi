import { Injectable, Output, EventEmitter } from '@angular/core';
import { ChannelData, EventData } from 'src/app/classes.model';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ChannelNavBarService {
  channel: ChannelData;

  private channelUpdateStatus = new BehaviorSubject(false);
  currentChannelUpdateStatus = this.channelUpdateStatus.asObservable();

  // This will trigger a subscription in interface.component.ts indicating whether to view channel messages or other
  interfaceViewUpdate: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}


  @Output() setChannel: EventEmitter<ChannelData> = new EventEmitter();

  setNavData(channelData: ChannelData) {
    this.channel = channelData;
    this.setChannel.emit(this.channel);
  }

  changeChannelUpdateStatus(status: boolean) {
    this.channelUpdateStatus.next(status);
  }

  getInterfaceViewListener(): Observable<string> {
    return this.interfaceViewUpdate.asObservable();
  }

  updateInterfaceView(viewConstant: string) {
    this.interfaceViewUpdate.next(viewConstant);
  }

  getEventsForChannel() {
    return this.http.get<{channels: string[], attending: EventData[], available: EventData[]}>(`/get-events?channel=${this.channel.id}`);
  }
}
