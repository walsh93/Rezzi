import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ChannelData, BotMessage, NodeSession, AbbreviatedUserProfile } from '../../../../classes.model';
import { MessagesService } from '../../messages/messages.service';

// export interface ChannelData {
//   id: number,
//   channel: string,
//   users: number
// }

@Component({
  selector: 'app-join-channel',
  templateUrl: './join-channel.component.html',
  styleUrls: ['./join-channel.component.css']
})

export class JoinChannelComponent implements OnInit {
  // Node session data
  private nodeSession: NodeSession;

  // User profile data
  private userProfileAbr: AbbreviatedUserProfile;

  channels: ChannelData[];
  columnsToDisplay = ['channel', 'user-count', 'join-channel'];
  @Output() public joinChannelEvent = new EventEmitter();

  private userName: string;

  constructor(public dialogRef: MatDialogRef<JoinChannelComponent>, @Inject(MAT_DIALOG_DATA) public data,
              private http: HttpClient, private messagesService: MessagesService) {

    console.log(data);
    this.channels = data.channels;
    this.nodeSession = data.session;
    this.userProfileAbr = data.user;

    if (this.userProfileAbr.nickName == null || this.userProfileAbr.nickName === undefined || this.userProfileAbr.nickName.length === 0) {
      this.userName = `${this.userProfileAbr.firstName} ${this.userProfileAbr.lastName}`;
    } else {
      this.userName = this.userProfileAbr.nickName;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  joinChannel(id: string) {
    console.log('Would send a request to database to join channel ' + id);
    this.http.post<{notification: string}>('/join-channel', {channel_id: id}).subscribe(responseData => {
      console.log(responseData.notification);
    });
    this.channels.forEach(hall => {
      hall.subchannels.forEach(channel => {
        if (channel.id === id) {
          channel.belongs = true;
        }
      });
    });
    this.joinChannelEvent.emit(id);
    this.messagesService.addBotMessage(BotMessage.UserHasJoinedChannel, this.userName, this.nodeSession.rezzi, id);
  }

  ngOnInit() {}
}
