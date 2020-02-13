import { Component, OnInit } from "@angular/core";

export interface Tile {
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: "app-edit-profile-form",
  templateUrl: "./edit-profile-form.component.html",
  styleUrls: ["./edit-profile-form.component.css"]
})
export class EditProfileFormComponent implements OnInit {
  tiles: Tile[] = [
    { text: "One", cols: 4, rows: 1 },
    { text: "Two", cols: 1, rows: 1 },
    { text: "Three", cols: 1, rows: 1 },
    { text: "Four", cols: 2, rows: 1 }
  ];
  constructor() {}

  ngOnInit(): void {}
}
