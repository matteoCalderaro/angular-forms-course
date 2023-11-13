import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { CoursesService } from "../services/courses.service";
import { map } from "rxjs/operators";

export function courseTitleValidator(
  courseService: CoursesService
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return courseService.findAllCourses().pipe(
      map((courses) => {
        const course = courses.find(
          (course) =>
            course.description.toLowerCase() == control.value.toLowerCase()
        );

        return course ? { existingTitle: true } : null;
      })
    );
  };
}
