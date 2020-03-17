import { Component, OnInit } from '@angular/core';
import { RezziService } from 'src/app/rezzi.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pm-interface',
  templateUrl: './pm-interface.component.html',
  styleUrls: ['./pm-interface.component.css']
})
export class PmInterfaceComponent implements OnInit {

  viewingUpdateSubject: Subject<string> = new Subject<string>();


  constructor(private rezziService: RezziService) { }

  ngOnInit() {
  }

  viewingNewUser(userID: string){
    this.viewingUpdateSubject.next(userID);
  }
}
