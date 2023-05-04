import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-layout-footer",
  templateUrl: "./footer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink],
  standalone: true,
})
export class FooterComponent {
  today: number = Date.now();
}
