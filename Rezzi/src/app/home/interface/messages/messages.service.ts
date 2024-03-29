import { Message, SocketMessageData, BotMessage, SocketChannelMessageData, IMAGE_BASE_URL, EventData, User } from '../../../classes.model';
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

    // Set socket event responders (backend socket will trigger these through .emit() calls)

    /**
     * added-new-message gets triggered when the channel is first viewed and when a new message comes in
     * When a channel has been viewed, moved away from, and then viewed again, this is not triggered until someone sends another
     * message
     */
    this.socket.on('added-new-message', (updatedMessages) => {
      this.messages = updatedMessages;
      this.messagesUpdated.next([...this.messages]);
    });

    this.socket.on('added-new-private-message', (updatedMessages) => {
      console.log('added-new-private-message triggered');
      this.messages = updatedMessages;
      this.messagesUpdated.next([...this.messages]);
    });
  }

  /*********************************************************************************************************************************
   * Events and listeners
   ********************************************************************************************************************************/
  getMessageUpdateListener() {
    return this.messagesUpdated.asObservable(); // asObservable is to protect the data
  }

  /*********************************************************************************************************************************
   * Message retrieval
   ********************************************************************************************************************************/
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
      this.messages = data.messages;
      this.messagesUpdated.next([...this.messages]);
    });
  }

  getPrivateMessages(pmUserPath: string, pmUser: string) {
    this.http.get<{messages: Message[]}>(`/private-messages?pmUserPath=${pmUserPath}&pmUser=${pmUser}`).subscribe((data) => {
      console.log('RETRIEVED private messages', data);
      this.messages = data.messages;
      this.messagesUpdated.next([...this.messages]);
    });
  }

  /*********************************************************************************************************************************
   * Message sending and Message Bot
   ********************************************************************************************************************************/

  addBotMessage(type: BotMessage, userName: string, rezzi: string, channelID: string) {
    let messageContent: string = null;
    if (type === BotMessage.UserHasJoinedChannel) {
      messageContent = `${userName} has joined the channel`;
    } else if (type === BotMessage.UserHasLeftChannel) {
      messageContent = `${userName} has left the channel`;
    } else if (type === BotMessage.EventHasBeenCanceled) {
      messageContent = `${userName} has been canceled`;
    } else {
      alert('Our message Bot got an unexpected request. Please try again later.');
      return;
    }

    const message: Message = {
      id: 'BOT_MSG',
      owner: null,
      content: messageContent,
      time: new Date(),
      visible: true,
      reactions: null,
      reported: false,
      image: null,
      event: null,
      isPoll: false,
      pollInfo: null,
    };
    const scmd: SocketChannelMessageData = {
      message, rezzi, channelID,
    };

    this.sendMessageThroughSocket(scmd);
  }

  public uploadImage(image: File) {
    const formData = new FormData();

    formData.append('image', image);

    return this.http.post<{url: string}>(IMAGE_BASE_URL + '/uploadImage', formData, { observe: 'response' });
  }

  public respondToEvent(user: User, event: EventData, response: string) {
    console.log(user.email + ' is ' + response + ' ' + event.name);
    const data = {
      user,
      event,
      response
    };
    return this.http.post('/respond-event', data);
  }

  public cancelEvent(event: EventData) {
    const data = {
      event
    };
    return this.http.post('/cancel-event', data);
  }

  /*********************************************************************************************************************************
   * Socket functions
   ********************************************************************************************************************************/

  /**
   * Emit another socket event indicating we need to listen to another channel
   * @param objectFromCreateChannelPath - the object returned after calling createChannelPath(string, string)
   */
  emitNewChannelView(objectFromCreateChannelPath: any) {
    this.socket.emit('new-channel-view', objectFromCreateChannelPath);
  }

  emitNewUserView(objectFromCreateUserPath: any) {
    this.socket.emit('new-private-view', objectFromCreateUserPath);
  }

  sendMessageThroughSocket(data: SocketMessageData) {
    this.socket.emit('new-message', data);
  }

  updateMessageThroughSocket(data: SocketMessageData) {
    this.socket.emit('update-message', data);
  }

  sendPrivateMessageThroughSocket(data: SocketMessageData) {
    this.socket.emit('new-private-message', data);
  }

  /*********************************************************************************************************************************
   * Helper functions
   ********************************************************************************************************************************/
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

  createUserPath(sender: string, receiver: string) {
    if (sender == null || receiver == null) {
      console.log('Path Creating Error messages.service.ts');
      return null;
    }
    const userPath = `users/${sender}/private-messages`;
    const receiverID = receiver;
    return { userPath, receiverID };
  }

}
