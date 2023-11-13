import {
  AfterViewChecked,
  Component,
  HostBinding,
  Input,
  OnInit,
} from "@angular/core";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { catchError, finalize } from "rxjs/operators";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { noop, of } from "rxjs";

@Component({
  selector: "file-upload",
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileUploadComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FileUploadComponent,
    },
  ],
})
export class FileUploadComponent implements ControlValueAccessor, Validator {
  @Input()
  requiredFileType: string;

  fileName = "";

  uploadProgress: number;
  fileUploadError = false;
  fileUploadSuccess = false;

  onChange = (fileName: string) => {};
  onTouched = () => {};

  disabled = false;

  onValidatorChange = () => {};

  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      console.log(this.fileName);

      const formData = new FormData();

      formData.append("thumbnail", file);

      this.fileUploadError = false;

      this.http
        .post("/api/thumbnail-upload", formData, {
          // the value emitted is not a plain value but http events such as HttpEventType.UploadProgress or HttpEventType.Response (in case of a succesfully response).
          // By default are emitted HttpEventType.Response but with 'reportProgress:true', are emitted also values about the progress
          reportProgress: true,
          observe: "events",
        })
        .pipe(
          catchError((error) => {
            this.fileUploadError = true;

            return of(error);
          }),
          finalize(() => {
            this.uploadProgress = null;
          })
        )
        .subscribe((event) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.disabled = true;
            this.uploadProgress = Math.round(
              100 * (event.loaded / event.total)
            );
          }
          if (event.type == HttpEventType.Response) {
            this.fileUploadSuccess = true;
            this.onChange(this.fileName);
            this.onValidatorChange();
            this.disabled = false;
          }
        });
    }
  }

  onClick(fileUpload: HTMLInputElement) {
    this.onTouched();
    fileUpload.click();
  }

  writeValue(value: any): void {
    this.fileName = value;
  }
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  registerOnValidatorChange(onValidatorChange: () => void) {
    this.onValidatorChange = onValidatorChange;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    // if(this.fileUploadSuccess){
    //   return null
    // }
    let errors: any = {
      requiredFileType: this.requiredFileType,
    };
    if (this.fileUploadError) {
      errors.uploadFailed = true;
    }
    if (this.fileName) {
      const EXTs = ["jpg", "jpeg", "bmp", "gif", "png"];
      let ext: any = this.fileName.split(".");
      ext = ext[ext.length - 1];

      if (!EXTs.includes(ext)) {
        errors.wrongFileType = true;
      }
    }
    if (!errors.wrongFileType && this.fileUploadSuccess) {
      return null;
    }
    return errors;
  }
}
