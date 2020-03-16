import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PrivateMessageData, Message } from 'src/app/classes.model';
import { PMSidePanelService } from './pm-side-panel.service';

@Component({
  selector: 'app-pm-side-panel',
  templateUrl: './pm-side-panel.component.html',
  styleUrls: ['./pm-side-panel.component.css'],
  providers: [PMSidePanelService],
})

export class PmSidePanelComponent implements OnInit {
  public private_messages: PrivateMessageData[];

  @Output() usersToSend = new EventEmitter<PrivateMessageData[]>();
  @Output() userToView = new EventEmitter<string>();

  constructor(private privateSidePanelService: PMSidePanelService) {
    this.private_messages = [];
    this.privateSidePanelService.getPrivateMessages().subscribe(data => {
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
        for ( const index2 in data[index].messages.messages) {
          messageContent.push({
            id: data[index].messages.messages[index2].id,
            content: data[index].messages.messages[index2].content,
            time: data[index].messages.messages[index2].time,
            visible: data[index].messages.messages[index2].visible,
            //will need to add more message details here
          });
        }
        //console.log(messageContent);
        // tempData.messages = data[index].messages;
        // console.log("Temp Data: ", tempData);

        this.private_messages.push({
          recipient: data[index].recipient,
          messages: messageContent,
        });

      }
      console.log(this.private_messages);

    });
  }

  ngOnInit() {
  }

  viewUser(user: string) {
    console.log("view User", user);
    this.userToView.emit(user);
  }

}
