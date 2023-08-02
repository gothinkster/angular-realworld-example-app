import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  ViewRef,
} from "@angular/core";
import { UserService } from "../core/services/user.service";

@Directive({
  selector: "[appShowAuthed]",
  standalone: true,
})
export class ShowAuthedDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private userService: UserService,
    private viewContainer: ViewContainerRef
  ) {}

  condition: boolean = false;

  authRef: ViewRef | undefined;

  ngOnInit() {
    this.userService.isAuthenticated.subscribe((isAuthenticated: boolean) => {
      if (
        (isAuthenticated && this.condition) ||
        (!isAuthenticated && !this.condition)
      ) {
        if (!this.authRef) {
          this.authRef = this.viewContainer.createEmbeddedView(
            this.templateRef
          );
        }
      } else {
        this.viewContainer.clear();
      }
    });
  }

  @Input() set appShowAuthed(condition: boolean) {
    this.condition = condition;
  }
}
