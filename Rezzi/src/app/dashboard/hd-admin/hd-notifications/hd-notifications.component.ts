import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../../rezzi.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { Message, SocketPrivateMessageData, SocketChannelMessageData } from 'src/app/classes.model';
import { MessagesService } from 'src/app/home/interface/messages/messages.service';

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
              private messagesService: MessagesService) { }

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
    const confirmedDelete = confirm(`Are you sure you would like to approve the deletion of the account ${email}?`);

    // TODO add ability to deny request in Dialog box, remove from requests but not from database

    if (!confirmedDelete) {
      return;
    }

    console.log('Email to be deleted: ' + email);
    const body = {
      email,
      hdemail: this.session.email,
      rezzi: this.session.rezzi
    };

    this.http.post('/deleteUser', body).toPromise().then((response) => {
      location.reload();
    }).catch((error) => {
      const res = error as HttpErrorResponse;
      if (res.status === 200) {
        alert(res.error.text);  // an alert is blocking, so the subsequent code will only run once alert closed
        location.reload();
      } else {
        alert(`There was an error while trying to delete this user (${res.status}). Please try again later.`);
      }
    });

  }

  removeMessage(msg: Message) {
    const retVal = confirm('Are you sure you want to remove this message? This cannot be undone');

    // TODO add ability to deny request in Dialog box, remove from requests but not from database

    if (retVal !== true) { // retVal != true if they hit cancel.
      return;
    }
    if (!msg.id.includes('floors') && !msg.id.includes('hallwide') && !msg.id.includes('RA')) { // is PM
      const spmd: SocketPrivateMessageData = {
        message: msg,
        sender: msg.owner.email,      // I *think*
        recipient: this.session.email // I *also think*
      };
      spmd.message.visible = false;
      this.messagesService.updateMessageThroughSocket(spmd);
    } else {

      if (msg.id.includes('floors')) {
        this.channelId = msg.id.split('-')[0] + '-' + msg.id.split('-')[1] + '-' + msg.id.split('-')[2];
      } else {
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

    const index = this.reportedMessages.indexOf(msg);
    if (index !== -1) {
      this.reportedMessages.splice(index, 1);
    }

    this.rezziService.deleteReportedMessage(msg.id, this.HDemail);

    alert('The message has been removed.');
  }

}
