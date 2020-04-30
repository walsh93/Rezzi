import { Component, OnInit, Inject } from '@angular/core';
import { RezziService } from '../../../rezzi.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { Message, SocketPrivateMessageData, SocketChannelMessageData, ChannelData } from 'src/app/classes.model';
import { MessagesService } from 'src/app/home/interface/messages/messages.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';

export interface ConfirmStatus {
  confirmStatus: number;
  action: string;
}

@Component({
  selector: 'app-hd-notifications',
  templateUrl: './hd-notifications.component.html',
  styleUrls: ['./hd-notifications.component.css']
})
export class HdNotificationsComponent implements OnInit {

  // Class variables
  errorMsg: string;
  session: any;
  deletionRequests: Array<string>;
  reportedMessageIDs: Array<string>;
  reportedMessages: Array<Message> = [];
  msg: Message;
  rezzi: string;
  channelId: string;
  HDemail: string;

  panelOpenState = false;

  constructor(private rezziService: RezziService,
              private router: Router,
              private http: HttpClient,
              private messagesService: MessagesService,
              public hdNotificationsDialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.errorMsg = '';

    this.rezziService.getSession().then((session) => {
        this.session = session;
        this.rezzi = this.session.rezzi;
        this.HDemail = this.session.email;
    });

    this.rezziService.getDeletionRequests().then(deletionRequests => {
      // console.log('Deletion request list IS ' + deletionRequests.deletionRequests);
      if (deletionRequests == null) {
        this.deletionRequests = ['there are no requests'];
      } else {
        this.deletionRequests = deletionRequests.deletionRequests;
      }
    });

    this.rezziService.getReportedMessages().then(reportedMessageIDs => {
      if (reportedMessageIDs == null) {
        this.reportedMessageIDs = ['there are no reports'];
      } else {
        this.reportedMessageIDs = reportedMessageIDs.reportedMessages;

        for (const message of this.reportedMessageIDs) {
          this.rezziService.getMessage(message).then(mess => {
            this.msg = mess.message;
            this.reportedMessages.push(this.msg);
          });
        }

      }
    });

  }

  deleteUser(email: string) {
    const hdDialogRef = this.hdNotificationsDialog.open(HdNotificationsDialog, {
      width: '450px',
      height: '200px',
      data: {
        action: 'delete this user',
      }
    });

    hdDialogRef.afterClosed().subscribe(deleteStatus => {
      switch (deleteStatus) {
        case 0:   // user cancelled
          return;

        case 2:   // user confirmed
          // console.log('Email to be deleted: ' + email);
          const body = {
            email,
            hdemail: this.session.email,
            rezzi: this.session.rezzi
          };

          this.http.post('/deleteUser', body).toPromise().then((response) => {
          }).catch((error) => {
            const res = error as HttpErrorResponse;
            if (res.status === 200) {
              this.snackBar.open(res.error.text);
            } else {
              this.snackBar.open(`There was an error while trying to delete this user (${res.status}). Please try again later.`);
            }
          });

          this.snackBar.open('The user has been removed.');
          /* falls through */
        case 1:   // user denied (doesn't need to stay in requests any longer)
          const index = this.deletionRequests.indexOf(email);
          if (index !== -1) {
            this.deletionRequests.splice(index, 1);
          }
          if (deleteStatus === 1) {
            this.snackBar.open('The user\'s delete request has been denied.');
          }
      }
    });
  }

  removeMessage(msg: Message) {
    const hdDialogRef = this.hdNotificationsDialog.open(HdNotificationsDialog, {
      width: '450px',
      height: '200px',
      data: {
        action: 'remove this message',
      }
    });

    hdDialogRef.afterClosed().subscribe(deleteStatus => {
      switch (deleteStatus) {
        case 0:   // user cancelled
          return;

        case 2:   // user confirmed
          if (!msg.id.includes('floors') && !msg.id.includes('hallwide') && !msg.id.includes('RA')) { // is PM
            const spmd: SocketPrivateMessageData = {
              message: msg,
              sender: msg.owner.email,      // I *think*
              recipient: this.session.email // I *also think*
            };
            spmd.message.visible = false;
            this.messagesService.updateMessageThroughSocket(spmd);
          } else {  // not PM

            if (msg.id.includes('floors')) {  // floor channel
              this.channelId = msg.id.split('-')[0] + '-' + msg.id.split('-')[1] + '-' + msg.id.split('-')[2];
            } else {  // not floor channel
              this.channelId = msg.id.split('-')[0] + '-' + msg.id.split('-')[1];
            }

            const scmd: SocketChannelMessageData = {
              message: msg,
              rezzi: this.rezzi,
              channelID: this.channelId
            };
            scmd.message.visible = false;
            this.messagesService.updateMessageThroughSocket(scmd);
          }
          this.rezziService.deleteReportedMessage(msg.id, this.HDemail);

          this.snackBar.open('The message has been removed.');
          /* falls through */
        case 1:   // user denied (doesn't need to stay in requests any longer)
          const index = this.reportedMessages.indexOf(msg);
          if (index !== -1) {
            this.reportedMessages.splice(index, 1);
          }
          if (deleteStatus === 1){
            this.snackBar.open('The message report has been denied.');
          }
      }
    });
  }
}

/* HD Notifications Dialog Component */
@Component({
  selector: 'app-hd-notifications-dialog',
  templateUrl: 'hd-notifications-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class HdNotificationsDialog implements OnInit {
  action: string;

  constructor(public hdDialogRef: MatDialogRef<HdNotificationsDialog>,
              @Inject(MAT_DIALOG_DATA) public status: ConfirmStatus,
  ) {
    this.action = status.action;
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.hdDialogRef.close(0);
  }

  onDenyClick(): void {
    this.hdDialogRef.close(1);
  }

  onConfirmClick(): void {
    this.hdDialogRef.close(2);
  }

}
