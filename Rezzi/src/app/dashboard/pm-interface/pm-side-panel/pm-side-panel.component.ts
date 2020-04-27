import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
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
  oldUser;
  @Input() viewing: string;

  @Output() pmUsersToSend = new EventEmitter<PrivateMessageData[]>();
  @Output() pmUserToView = new EventEmitter<string>();

  constructor(
    public dialog: MatDialog,
    private privateSidePanelService: PMSidePanelService) {
    this.private_message_users = [];
    this.privateSidePanelService.getPrivateMessageUsers().subscribe(data => {
      // tslint:disable-next-line: forin
      for (const index in data) {
        let messageContent: Message[] = [];
        // tslint:disable-next-line: forin
        for (const index2 in data[index].messages.messages) {
          messageContent.push({
            owner: data[index].messages.messages[index2].owner,
            content: data[index].messages.messages[index2].content,
            time: data[index].messages.messages[index2].time,
            visible: data[index].messages.messages[index2].visible,
            reactions: data[index].messages.messages[index2].reactions,
            reported: data[index].messages.messages[index2].reported,
            id: data[index].messages.messages[index2].id,
            image: data[index].messages.messages[index2].image,
            event: null,
            isPoll: false,
            pollInfo: null,
            //will need to add more message details here
          });
        }

        this.private_message_users.push({
          recipient: data[index].recipient,
          messages: messageContent,
        });

      }
      //console.log(this.private_message_users);
      this.pmUsersToSend.emit(this.private_message_users)

    });

  }

  openPMDialog(): void {
    this.non_pm_users.length = 0;
    console.log(this.non_pm_users);
    this.privateSidePanelService.getNonPrivateMessageUsers().subscribe(data => {
      // tslint:disable-next-line: forin
      for (const index in data) {
        this.non_pm_users.push(data[index])
      }
      console.log(this.non_pm_users);
      //console.log(this.non_pm_users);
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
    })



  }


  ngOnInit() {
    this.oldUser = this.viewing;
    this.non_pm_users.length = 0;
    this.privateSidePanelService.getNonPrivateMessageUsers().subscribe(data => {
      // tslint:disable-next-line: forin
      for (const index in data) {
        this.non_pm_users.push(data[index])
      }
      //console.log(this.non_pm_users);
    })
  }

  viewUser(user: string) {
    if(this.oldUser==null && this.viewing){
      this.oldUser = this.viewing
      document.getElementById(this.oldUser).style.background = document.getElementById(user).style.color
    }
    else if(this.oldUser==null && !this.viewing){
      this.oldUser = user;
    }
    else{
      //get old user by ID and set back to regular
      document.getElementById(this.oldUser).style.background = document.getElementById(user).style.color
    }
    document.getElementById(user).style.background = "#607d8b"
    this.oldUser = user;
    console.log("Viewing user ", user);
    this.pmUserToView.emit(user);
  }

}
