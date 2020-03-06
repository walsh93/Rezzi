import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../rezzi.service';
import { ChannelData } from '../../classes.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  session: any;
  resHall: string;

  // Passing channels and session to child component channel-messages every time they update
  channelsUpdateSubject: Subject<ChannelData[]> = new Subject<ChannelData[]>();
  sessionUpdateSubject: Subject<any> = new Subject<any>();

  constructor(private rezziService: RezziService) { }

  ngOnInit() {
    this.rezziService.getSession().then((session) => {
      this.session = session;
      this.sessionUpdateSubject.next(session);
      this.resHall = this.session.rezzi;
    });
  }

  receivedChannels(channels: ChannelData[]) {
    this.channelsUpdateSubject.next(channels);
  }

}
