import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/classes.model';
import { HttpClient } from '@angular/common/http';
import { RezziService } from 'src/app/rezzi.service';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {
  hide = true;

  session;
  constructor(private rezziService: RezziService, private http: HttpClient) { }

  ngOnInit() : void {
    // Initialize class variables
    this.rezziService.getSession().then((__session) => {
        this.session = __session;
    })
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // if(form.value.age)
    // return;
    const user = new User(
      this.session.email,
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
  this.http.post<{notification: string}>('/sign-up/api/sign-up', user)
    .subscribe(responseData => {
      //console.log(responseData.notification);
      alert(responseData.notification); // conley-edit-here
      // if success go home else show message indicating error
    });
}

}
