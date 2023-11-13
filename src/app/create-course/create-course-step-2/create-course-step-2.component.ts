import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { createDateRangeValidator } from "../../validators/date-range.validator";

@Component({
  selector: "create-course-step-2",
  templateUrl: "create-course-step-2.component.html",
  styleUrls: ["create-course-step-2.component.scss"],
})
export class CreateCourseStep2Component implements OnInit {
  valueTest = "ciao";

  form = this.fb.group(
    {
      courseType: ["premium", Validators.required],
      price: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(9999),
          Validators.pattern("[0-9]+"),
        ],
      ],
      promoStartAt: [null, Validators.required],
      promoEndAt: [null, Validators.required],
      thumbnail: [null],
    },
    {
      validators: [createDateRangeValidator()],
      //updateOn: "blur",
    }
  );

  ngOnInit() {
    this.form.valueChanges.subscribe((val) => {
      const priceControl = this.form.controls["price"];

      if (val.courseType == "free" && priceControl.enabled) {
        priceControl.disable({ emitEvent: false });
      } else if (val.courseType == "premium" && priceControl.disabled) {
        priceControl.enable({ emitEvent: false });
      }
    });
  }

  get fileType() {
    return this.form.controls["thumbnail"];
  }
  constructor(private fb: FormBuilder) {}
}
