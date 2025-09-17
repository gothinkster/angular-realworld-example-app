import { Component, Input } from "@angular/core";
import { Errors } from "../../core/models/errors.model";

@Component({
  selector: "app-error-list",
  templateUrl: "./error-list.html",
})
export class ErrorList {
  errorList: string[] = [];

  @Input() set errors(errorList: Errors | null) {
    this.errorList = errorList
      ? Object.keys(errorList.errors || {}).map(
          (key) => `${key} ${errorList.errors[key]}`,
        )
      : [];
  }
}
