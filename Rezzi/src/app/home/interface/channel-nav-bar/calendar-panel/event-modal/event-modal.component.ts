import { Component, OnInit, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventData, User } from 'src/app/classes.model';
import { MessagesService } from 'src/app/home/interface/messages/messages.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { parseISO } from 'date-fns';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent implements OnInit {
  event: EventData;
  user: User;
  prettyStart: string;
  prettyEnd: string;

  ds_going: MatTableDataSource<{displayname: string, email: string}>;
  @ViewChild(MatPaginator, {static: true}) paginator_g: MatPaginator;
  ds_interested: MatTableDataSource<{displayname: string, email: string}>;
  @ViewChild(MatPaginator, {static: true}) paginator_i: MatPaginator;
  ds_not_going: MatTableDataSource<{displayname: string, email: string}>;
  @ViewChild(MatPaginator, {static: true}) paginator_ng: MatPaginator;

  @Output() public EventResponseEvent = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public messagesService: MessagesService,
    public cancelDialog: MatDialog) {
    this.event = data.event;
    this.user = data.user;
    this.prettyStart = this.datePrettier(parseISO(this.event.start_time));
    this.prettyEnd = this.datePrettier(parseISO(this.event.end_time));

    this.ds_going = new MatTableDataSource<{displayname: string, email: string}>(this.transformUsers(this.event.attending.going));
    this.ds_going.paginator = this.paginator_g;
    this.ds_interested = new MatTableDataSource<{displayname: string, email: string}>(this.transformUsers(this.event.attending.interested));
    this.ds_interested.paginator = this.paginator_i;
    this.ds_not_going = new MatTableDataSource<{displayname: string, email: string}>(this.transformUsers(this.event.attending['not going']));
    this.ds_not_going.paginator = this.paginator_ng;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  respondToEvent(response: string) {
    this.EventResponseEvent.emit(response);
    this.messagesService.respondToEvent(this.user, this.event, response);
  }
  
  cancelEvent() {
    const cdRef = this.cancelDialog.open(ConfirmCancelEventDialogComponent, {
      width: '350px',
    });

    cdRef.afterClosed().subscribe(result => {
      if (result) {
        this.messagesService.cancelEvent(this.event);
        this.dialogRef.close('canceled');
      }
    });
  }

  datePrettier(og: Date): string {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const monthNames = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
    const day = dayNames[og.getDay()];
    const month = monthNames[og.getMonth()];
    const date = og.getDate();
    const hr = og.getHours();
    const hours = hr > 12 ? `${hr - 12}` : `${hr}`;
    const min = og.getMinutes();
    const minutes = min < 10 ? `0${min}` : `${min}`;
    const apm = hr > 11 ? 'PM' : 'AM';
    return `${day}, ${month} ${date} at ${hours}:${minutes} ${apm}`;
  }

  transformUsers(users: User[]): {displayname: string, email: string}[] {
    let returned: {displayname: string, email: string}[] = [];
    users.forEach(user => {
      if (user.nickName !== '') {
        returned.push({displayname: user.nickName, email: user.email});
      }
      else {
        returned.push({displayname: user.firstName + ' ' + user.lastName, email: user.email});
      }
    });
    return returned;
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'dialog-confirm-cancel-event',
  template: '<div mat-dialog-content>Are you sure you\'d like to cancel this event?</div>' + 
    '<div mat-dialog-actions>' +
      '<button mat-button (click)=onNoClick()>No</button>' + 
      '<button mat-button [mat-dialog-close]="true" cdkFocusInitial>Yes</button>' +
    '</div>',
})
export class ConfirmCancelEventDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmCancelEventDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}