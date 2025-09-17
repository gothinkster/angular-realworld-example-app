import { HttpInterceptorFn } from "@angular/common/http";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({ url: `https://api.realworld.io/api${req.url}` });
  return next(apiReq);
};
