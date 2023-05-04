import { Component, Input } from "@angular/core";
import { Errors } from "../core/models/errors.model";
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: "app-list-errors",
  templateUrl: "./list-errors.component.html",
  imports: [NgIf, NgForOf],
  standalone: true,
})
export class ListErrorsComponent {
  errorList: string[] = [];

  @Input() set errors(errorList: Errors | null) {
    this.errorList = errorList
      ? Object.keys(errorList.errors || {}).map(
          (key) => `${key} ${errorList.errors[key]}`
        )
      : [];
  }
}
