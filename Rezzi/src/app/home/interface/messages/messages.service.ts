import { Message, SocketMessageData } from '../../../classes.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({ providedIn: 'root' })

export class MessagesService {
  private messages: Message[] = [];
  private messagesUpdated = new Subject<Message[]>();

  // Messaging with Socket.IO
  private url = 'http://localhost:4100';
  private socket;

  constructor(private http: HttpClient) {
    this.socket = io(this.url);
  }

  getMessages() {
    this.http.get<{notification: string, messages: Message[]}>('http://localhost:4100/api/messages')
    .subscribe((messageData) => {
      this.messages = messageData.messages; // messages coming from server is messageData.messages
      this.messagesUpdated.next([...this.messages]);
     }); // Don't need to store
    // return [...this.messages]; // pulling messages into new array (hence the [...])
  }

  getChannelMessages(channelPath: string, channelName: string) {
    this.http.get<{messages: Message[]}>(`/channel-messages?channelPath=${channelPath}&channelName=${channelName}`).subscribe((data) => {
      console.log('RETRIEVED messages', data);
      this.messages = data.messages;
      this.messagesUpdated.next(this.messages);
    });
  }

  getMessageUpdateListener() {
    return this.messagesUpdated.asObservable(); // asObservable is to protect the data
  }

  addMessage(message: Message) {
    this.http.post<{notification: string}>('http://localhost:4100/api/messages', message).subscribe(responseData => {
      console.log(responseData.notification);
      this.messages.push(message);
      this.messagesUpdated.next([...this.messages]);
    });
  }

  sendMessageThroughSocket(message: SocketMessageData) {
    this.socket.emit('new-message', message);
  }

  createChannelPath(rezzi: string, channelID: string) {
    if (channelID != null) {
      const resHallPath = `residence-halls/${rezzi}`;
      let channelPath = null;
      let channelName = null;
      const level = channelID.split('-')[0];
      if (level === 'floors') {
        // does NOT consider whether floor name has a '-', but DOES consider if channel name has a '-'
        const firstDash = channelID.indexOf('-');
        const secondDash = channelID.indexOf('-', firstDash + 1);
        const floorName = channelID.slice(firstDash + 1, secondDash);
        channelName = channelID.slice(secondDash + 1);
        channelPath = `${resHallPath}/floors/${floorName}/channels`;
      } else {  // either 'hallwide' or 'RA'
        const dash = channelID.indexOf('-');
        const hwOrRa = channelID.slice(0, dash);
        channelName = channelID.slice(dash + 1);
        channelPath = `${resHallPath}/${hwOrRa}`;
      }

      if (channelPath == null || channelName == null) {
        return null;
      }

      return { channelPath, channelName };
    }

    return null;
  }

}
