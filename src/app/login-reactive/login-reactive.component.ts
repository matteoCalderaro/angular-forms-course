import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";
import { createPasswordStrengthValidator } from "../validators/password-strength.validator";
import { ThisReceiver } from "@angular/compiler";

@Component({
  selector: "login",
  templateUrl: "./login-reactive.component.html",
  styleUrls: ["./login-reactive.component.css"],
})
export class LoginReactiveComponent implements OnInit {
  form = this.fb.group({
    email: [
      "",
      {
        validators: [Validators.required, Validators.email],
        updateOn: "blur",
      },
    ],
    password: [
      "",
      [
        Validators.required,
        Validators.minLength(8),
        createPasswordStrengthValidator(),
      ],
    ],
  });

  login() {
    this.form.patchValue({
      email: "barbone",
    });
    console.log(this.form.value.email);
  }

  reset() {
    this.form.reset();
    console.log(this.form.value);
  }

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit() {}
}
