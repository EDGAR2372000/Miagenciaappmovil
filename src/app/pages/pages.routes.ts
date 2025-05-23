import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoadRequestComponent } from "./load-request/load-request.component";
import { LoadRequestFormComponent } from "./load-request/load-request-form/load-request-form.component";


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
      }
];
