import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { UserService } from "../services/user.service";

@Injectable({ providedIn: "root" })
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authSvc: UserService) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((err) => {
      if ([401, 403].includes(JSON.parse(err.status))) {
        this.authSvc.logout()
      }
      const error = err.error.message || err.statusText
      throwError(() => error)
    }));
  }
}
