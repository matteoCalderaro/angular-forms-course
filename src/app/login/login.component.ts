import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  val = {
    email: "matteo@gmail.com",
    password: 123,
  };
  constructor() {}

  ngOnInit() {}

  login(loginForm: NgForm, submit) {
    console.log(
      "valori:",
      loginForm.value,
      "validità:",
      loginForm.valid,
      "evento submit:",
      submit
    );
  }
  onEmailChange(change) {
    console.log(change);
  }
}
