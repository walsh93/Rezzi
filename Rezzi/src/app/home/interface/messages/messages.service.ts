import { Message } from '../../../classes.model';
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

  getMessageUpdateListener() {
    return this.messagesUpdated.asObservable(); // asObservable is to protect the data
  }

  addMessage(message: Message) {
    this.socket.emit('new-message', message);
    this.http.post<{notification: string}>('http://localhost:4100/api/messages', message).subscribe(responseData => {
      console.log(responseData.notification);
      this.messages.push(message);
      this.messagesUpdated.next([...this.messages]);
    });
  }
}
