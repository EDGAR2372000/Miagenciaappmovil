import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoadRequestComponent } from "./load-request/load-request.component";
import { LoadRequestFormComponent } from "./load-request/load-request-form/load-request-form.component";
import { LoadsComponent } from "./carrier/loads/loads.component";
import { ReviewLoadComponent } from "./carrier/review-load/review-load.component";
import { ReviewLoadRequestComponent } from "./load-request/review-load-request/review-load-request.component";
import { ProfileComponent } from "./carrier/profile/profile.component";
import { LoadRequestStatusComponent } from "./carrier/load-request-status/load-request-status.component";
import { OnTheWayComponent } from "./load-request/on-the-way/on-the-way.component";


export const PagesRoutes: Routes = [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'loads-requests',
      component: LoadRequestComponent
    },
    {
      path: 'load-requests/create',
      component: LoadRequestFormComponent
    },
    {
      path: 'load-requests/edit/:id',
      component: LoadRequestFormComponent
    },
    {
      path: 'loads',
      component: LoadsComponent
    },
    {
      path: 'review-load/:id',
      component: ReviewLoadComponent  
    },
    {
      path: 'review-load-request/:id',
      component: ReviewLoadRequestComponent
    },
    {
      path: 'company-profile',
      component: ProfileComponent
    },
    {
      path: 'load-requests-orders',
      component: LoadRequestStatusComponent
    },
    {
      path: 'tracking/:id',
      component: OnTheWayComponent
    }
];
