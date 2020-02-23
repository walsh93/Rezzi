import { Component, OnInit } from '@angular/core';
import { CreateRezziService } from './create-rezzi.service';

@Component({
  selector: 'app-create-rezzi',
  templateUrl: './create-rezzi.component.html',
  styleUrls: ['./create-rezzi.component.css']
})
export class CreateRezziComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  createRezzi() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    var body = {};

    this.http.post('/create-rezzi', body).toPromise().then((response) => {

    }).catch((error) => {

    });
  }

  ngOnInit(): void {
  }

}
