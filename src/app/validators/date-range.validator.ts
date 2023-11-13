import { FormGroup, ValidatorFn, Validators } from "@angular/forms";

export function createDateRangeValidator():ValidatorFn{
  return (form: FormGroup): Validators| null => {

    const start: Date = form.get('promoStartAt').value
    const end: Date = form.get('promoEndAt').value
    
    if(start && end){
      const validRange = end.getTime() - start.getTime() > 0 
      return validRange ? null : {invalidRange:true}
    }
    return null
    
    
  }
}