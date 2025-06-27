import { HttpInterceptorFn } from '@angular/common/http';

export const serverErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
