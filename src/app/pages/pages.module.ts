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

@NgModule({
  declarations: [
    DashboardComponent,
    LoadRequestComponent,
    LoadRequestFormComponent,
    LayoutComponent,
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
