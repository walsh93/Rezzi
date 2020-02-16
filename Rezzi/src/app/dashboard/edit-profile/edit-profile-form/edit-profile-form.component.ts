import { Component, OnInit } from "@angular/core";
import { User } from "src/app/classes.model";
import { RezziService } from "../../../rezzi.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-profile-form",
  templateUrl: "./edit-profile-form.component.html",
  styleUrls: ["./edit-profile-form.component.css"]
})
export class EditProfileFormComponent implements OnInit {
  constructor(private rezziService: RezziService, private router: Router) {}

  ngOnInit() {
    this.rezziService.getSession().then(response => {
      if (response.email == null) {
        // not signed in
        this.router.navigate(["/sign-in"]);
      } else if (response.verified === false) {
        // signed in but not verified
        this.router.navigate(["/sign-up"]);
      } // else signed in and verified
    });
  }
}
