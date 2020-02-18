import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ChannelData {
  id: number,
  channel: string,
  users: number
}

@Injectable()
export class SidePanelService {
  constructor(private http: HttpClient) {}

  getChannels() {
    return this.http.get<ChannelData>('/get-channels');
  }
}