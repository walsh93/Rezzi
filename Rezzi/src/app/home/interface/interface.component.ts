import { Component, OnInit } from '@angular/core';
import { RezziService } from '../../rezzi.service';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  session: any;
  resHall: string;

  constructor(private rezziService: RezziService) { }

  ngOnInit() {
    this.rezziService.getSession().then((__session) => {
      this.session = __session;
      this.resHall = this.session.rezzi;
    });
  }

}
