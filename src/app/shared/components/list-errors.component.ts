import { Component, Input } from "@angular/core";
import { Errors } from "../../core/models/errors.model";

@Component({
  selector: "app-list-errors",
  templateUrl: "./list-errors.component.html",
})
export class ListErrorsComponent {
  errorList: string[] = [];

  @Input() set errors(errorList: Errors | null) {
    this.errorList = errorList
      ? Object.keys(errorList.errors || {}).map(
          (key) => `${key} ${errorList.errors[key]}`,
        )
      : [];
  }
}
