import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiSharedModule } from '../ui-shared/ui-shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';

import { RouterModule } from '@angular/router';
import { PagesRoutes } from './pages.routes';
import { LoadRequestComponent } from './load-request/load-request.component';
import '@angular/common/locales/global/es-PE';
import { LoadRequestFormComponent } from './load-request/load-request-form/load-request-form.component';
import { UppercaseDirective } from '../directives/shared/uppercase.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { OnlyNumbersDirective } from '../directives/shared/only-numbers.directive';
import { LoadsComponent } from './carrier/loads/loads.component';
import { ReviewLoadComponent } from './carrier/review-load/review-load.component';
import { ReviewLoadRequestComponent } from './load-request/review-load-request/review-load-request.component';
import { ProfileComponent } from './carrier/profile/profile.component';
import { DialogPaymentComponent } from './load-request/dialog-payment/dialog-payment.component';
import { PhotoviewerComponent } from './load-request/photoviewer/photoviewer.component';
import { LoadRequestStatusComponent } from './carrier/load-request-status/load-request-status.component';
import { OnTheWayComponent } from './load-request/on-the-way/on-the-way.component';


@NgModule({
  declarations: [
    DashboardComponent,
    LoadRequestComponent,
    LoadRequestFormComponent,
    LayoutComponent,
    ReviewLoadComponent,
    ReviewLoadRequestComponent,
    ProfileComponent,
    DialogPaymentComponent,
    PhotoviewerComponent,
    LoadsComponent,
    LoadRequestStatusComponent,
    OnTheWayComponent,
  ],
  imports: [
    CommonModule,
    UppercaseDirective,
    OnlyNumbersDirective,
    UiSharedModule,
    NgxCurrencyDirective,
    RouterModule.forChild(PagesRoutes),
  ],
  providers: [
     { provide: LOCALE_ID, useValue: 'es-PE' }
  ],
})
export class PagesModule { }
