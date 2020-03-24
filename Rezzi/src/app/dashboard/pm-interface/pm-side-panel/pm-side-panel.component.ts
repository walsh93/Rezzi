import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PrivateMessageData, Message } from 'src/app/classes.model';
import { PMSidePanelService } from './pm-side-panel.service';
import { MatDialog } from '@angular/material/dialog';
import { CreatePmComponent } from './create-pm/create-pm.component';

@Component({
  selector: 'app-pm-side-panel',
  templateUrl: './pm-side-panel.component.html',
  styleUrls: ['./pm-side-panel.component.css'],
  providers: [PMSidePanelService],
})

export class PmSidePanelComponent implements OnInit {
  public non_pm_users = [];
  public private_message_users: PrivateMessageData[];

  @Output() pmUsersToSend = new EventEmitter<PrivateMessageData[]>();
  @Output() pmUserToView = new EventEmitter<string>();

  constructor(
    public dialog: MatDialog,
    private privateSidePanelService: PMSidePanelService) {
    this.private_message_users = [];
    this.privateSidePanelService.getPrivateMessageUsers().subscribe(data => {
      console.log('We out here: ', data);
      // tslint:disable-next-line: forin
      for (const index in data) {
        // console.log(data[index]);
        //console.log(index);
        //console.log(data[index].recipient);
        //let tempData: PrivateMessageData;
        //tempData.recipient = data[index].recipient;
        let messageContent: Message[] = [];
        // tslint:disable-next-line: forin
        for (const index2 in data[index].messages.messages) {
          messageContent.push({
            owner: data[index].messages.messages[index2].owner,
            content: data[index].messages.messages[index2].content,
            time: data[index].messages.messages[index2].time,
            visible: data[index].messages.messages[index2].visible,
            reactions: data[index].messages.messages[index2].reactions,
            id: data[index].messages.messages[index2].id,
            //will need to add more message details here
          });
        }
        //console.log(messageContent);
        // tempData.messages = data[index].messages;
        // console.log("Temp Data: ", tempData);

        this.private_message_users.push({
          recipient: data[index].recipient,
          messages: messageContent,
        });

      }
      console.log(this.private_message_users);
      this.pmUsersToSend.emit(this.private_message_users)

    });
    this.privateSidePanelService.getNonPrivateMessageUsers().subscribe(data => {
      // tslint:disable-next-line: forin
      for (const index in data) {
        this.non_pm_users.push(data[index])
      }
      console.log("MADE IT HERE");
      console.log(this.non_pm_users);
    })
  }

  openPMDialog(): void {
    const dialogRef = this.dialog.open(CreatePmComponent, {
      width: '600px',
      height: 'auto',
      data: this.non_pm_users,
    });

    dialogRef.componentInstance.create_pm_event.subscribe((email: string) => {
      this.private_message_users.push({
        recipient: email,
        messages: null
      });
    });

  }


  ngOnInit() {
  }

  viewUser(user: string) {
    console.log("View User", user);
    this.pmUserToView.emit(user);
  }

}
