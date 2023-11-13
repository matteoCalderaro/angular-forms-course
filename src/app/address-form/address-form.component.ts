import {
  AfterViewChecked,
  Component,
  Input,
  OnDestroy,
  OnInit,
  forwardRef,
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from "@angular/forms";
import { noop, Subscription } from "rxjs";

@Component({
  selector: "address-form",
  templateUrl: "./address-form.component.html",
  styleUrls: ["./address-form.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AddressFormComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: AddressFormComponent,
    },
  ],
})
export class AddressFormComponent
  implements ControlValueAccessor, OnDestroy, Validator
{
  @Input()
  legend: string;

  onTouched = () => {};

  onChangeSub: Subscription;

  form: FormGroup = this.fb.group({
    addressLine1: [null, Validators.required],
    addressLine2: [null, Validators.required],
    zipCode: [null, Validators.required],
    city: [null, Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  registerOnChange(onChange: any) {
    this.onChangeSub = this.form.valueChanges.subscribe((val) => {
      console.log(val), onChange(val);
    });
  }

  ngOnDestroy() {
    this.onChangeSub.unsubscribe();
  }

  writeValue(value: any) {
    if (value) {
      //console.log(value);
      this.form.setValue(value);
    }
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: "Custom error message",
          },
        };
  }
}
