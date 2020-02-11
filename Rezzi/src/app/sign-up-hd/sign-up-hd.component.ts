import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RezziService } from '../rezzi.service';
import { Router } from '@angular/router';

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

  constructor(private rezziService: RezziService, private router: Router) { }

  /**
   * Get session data and determine whether or not you need to reroute
   * If the service is not called here, then if someone clicks a button to the Sign In page without
   * manually putting it in, the middleware function in permissions.js won't run
   */
  ngOnInit() {
    this.rezziService.getSession().then((response) => {
      if (response.email != null) {
        this.router.navigate(['/home']);
      }
    });
  }

}

class HDUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

