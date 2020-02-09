import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'sign-out-button',  // This is the name of this component's HTML tag
  templateUrl: './sign-out-button.component.html',
  styleUrls: ['./sign-out-button.component.css']
})
export class SignOutButtonComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  signOut() {
    this.http.get('/sign-out').toPromise().then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })
  }

}
