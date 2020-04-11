import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChannelData } from 'src/app/classes.model';

interface ChannelDataArrays {
  allChannels: ChannelData[];
  myChannels: ChannelData[];
}

@Injectable({
  providedIn: 'root'
})
export class SidePanelService {
  constructor(private http: HttpClient) {}

  getChannels(): Promise<ChannelDataArrays> {
    return this.http.get('/get-channels').toPromise().then(data => {
      const allChannels: ChannelData[] = [];
      const myChannels: ChannelData[] = [];
      for (const hall in data) {
        if (data.hasOwnProperty(hall)) {
          let tempBelongs = false;  // Set if the user doesn't belong to any chats within the category
          const tempChannels: ChannelData[] = [];
          // tslint:disable-next-line: forin
          for (const channel in data[hall]) {
            tempChannels.push({
              id: hall + '-' + channel,
              channel,
              users: data[hall][channel].users,
              belongs: data[hall][channel].belongs,
              isMuted: data[hall][channel].isMuted,
              subchannels: [],
              messages: data[hall][channel].messages
            });
            if (data[hall][channel].belongs) {
              tempBelongs = true;
            }

            // Filtered channels for sibling components
            if (data[hall][channel].belongs) {
              myChannels.push({
                id: hall + '-' + channel,
                channel,
                users: data[hall][channel].users,
                belongs: data[hall][channel].belongs,
                isMuted: data[hall][channel].isMuted,
                subchannels: [],
                messages: data[hall][channel].messages
              });
            }
          }
          let name = hall;
          if (hall.indexOf('floors') !== -1) {  // only use the back half of 'floors-...'
            name = hall.split('-')[1];
          }
          const temp: ChannelData = {
            id: '',
            channel: name,
            users: -1,
            belongs: tempBelongs,
            isMuted: false,
            subchannels: tempChannels,
            messages: []  // TODO does this temp thing have messages at any point???
          };
          allChannels.push(temp);
        }
      }
      const arrays: ChannelDataArrays = { allChannels, myChannels };
      return arrays;
    });
  }
}
