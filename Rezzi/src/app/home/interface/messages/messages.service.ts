import { Message } from '../../../classes.model';
import { Subject } from 'rxjs';

export class MessagesService {
  private messages: Message[] = [];
  private messagesUpdated = new Subject<Message[]>();

  getMessages() {
    return this.messages; // pulling messages into new array (hence the [...])
  }

  getMessageUpdateListener() {
    return this.messagesUpdated.asObservable(); // asObservable is to protect the data
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.messagesUpdated.next([...this.messages]);
  }
}
