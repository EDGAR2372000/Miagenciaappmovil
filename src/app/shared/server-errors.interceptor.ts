import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { EMPTY, Observable, catchError, finalize, retry, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { NotificationService } from "../service/notification.service";
import { NavController } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { LoaderService } from "../service/loader.service";

@Injectable({
    providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];
    constructor(
        private notificationService: NotificationService,
        private navController: NavController,
        public loaderService: LoaderService,
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.isLoading.next(true);
        // return next.handle(req).pipe(
        //     retry(environment.RETRY),
        //     tap(event => {
        //         if (event instanceof HttpResponse) {
        //             if (event.body && event.body.error === true && event.body.errorMessage) {
        //                 throw new Error(event.body.errorMessage);
        //             }
        //         }
        //     }),
        //     catchError(err => {
        //         if (err.status === 400) {
        //             this.notificationService.showError(err.message);
        //         } else if (err.status === 404) {
        //             this.notificationService.showError('No existe el recurso');
        //         } else if (err.status === 403 || err.status === 401) {
        //             this.notificationService.showError(err.error.message);
        //         } else if (err.status === 500) {
        //             this.notificationService.showError(err.error.message);
        //         } else {
        //             this.notificationService.showError(err.error.message);
        //         }
        //         return EMPTY;
        //     }),
        // );
        return next.handle(req).pipe(retry(environment.RETRY))
        .pipe(tap(event => {
            if (event instanceof HttpResponse) {
                if (event.body && event.body.error === true && event.body.errorMessage) {
                    throw new Error(event.body.errorMessage);
                }
            }
        })).pipe(catchError((err) => {
            if (err.status === 400) {
                this.notificationService.showError(err.message);
            } else if (err.status === 404) {
                this.notificationService.showError('No existe el recurso');
            } else if (err.status === 403 || err.status === 401) {
                this.notificationService.showError(err.error.message);
            } else if (err.status === 500) {
                this.notificationService.showError(err.error.message);
            } else {
                this.notificationService.showError(err.error.message);
            }
            return EMPTY;
        }),
            finalize(() => {
                // Remover la petición del array y ocultar el loader si no hay más peticiones activas
                this.removeRequest(req);
            })
        );
    }

    private removeRequest(request: HttpRequest<any>): void {
        const i = this.requests.indexOf(request);
        if (i >= 0) {
          this.requests.splice(i, 1);
        }
        // Ocultar el loader sólo si no quedan peticiones activas
        if (this.requests.length === 0) {
          this.loaderService.isLoading.next(false);
        }
    }
}
