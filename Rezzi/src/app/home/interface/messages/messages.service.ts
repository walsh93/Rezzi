import { Message } from '../../../classes.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private messages: Message[] = [];
  private messagesUpdated = new Subject<Message[]>();

  constructor(private http: HttpClient) { }

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
    this.http.post<{notification: string}>('http://localhost:4100/api/messages', message)
      .subscribe(responseData => {
        console.log(responseData.notification);
        this.messages.push(message);
        this.messagesUpdated.next([...this.messages]);
  });
  }
}
