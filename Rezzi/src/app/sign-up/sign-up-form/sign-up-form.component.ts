import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/classes.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  hide = true;
  constructor(private http: HttpClient) { }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // if(form.value.age)
    // return;
    console.log(form);
    const user = new User(
      form.value.email,
      form.value.password,
      form.value.firstName,
      form.value.lastName,
      form.value.age,
      form.value.major,
      form.value.nickName,
      form.value.bio,
      true
    );

    console.log(user);

    this.addUser(user);
    /*
    console.log(this.newUser);
    // check that email doesn't exist in database

    if (this.newUser.password !== this.newUser.confirmPassword) {
       alert('Your passwords do not match');
    } else {
      this.userCreatedHD.emit(this.newUser);
       // create account
       // send data to backend
       // account created successfully
    }*/
}

addUser(user: User) {
  this.http.post<{notification: string}>('http://localhost:4100/api/sign-up', user)
    .subscribe(responseData => {
      console.log(responseData.notification);
    });
}

  ngOnInit(): void {
  }

}
