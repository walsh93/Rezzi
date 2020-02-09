import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sign-up-hd',
  templateUrl: './sign-up-hd.component.html',
  styleUrls: ['./sign-up-hd.component.css']
})
export class SignUpHdComponent implements OnInit {
  hide = true;
  newUser = new HDUser();
  @Output() userCreatedHD = new EventEmitter();

  onSignUpHD() {
               console.log(this.newUser);
               // check that email doesn't exist in database

               if (this.newUser.password !== this.newUser.confirmPassword) {
                  alert('Your passwords do not match');
               } else {
                 this.userCreatedHD.emit(this.newUser);
                  // create account
                  // send data to backend
                  // account created successfully
               }
  }

  constructor() {}

  ngOnInit() {
  }

}

class HDUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

