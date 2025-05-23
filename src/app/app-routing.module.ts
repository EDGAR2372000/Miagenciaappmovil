
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'pages',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/pages.module').then(m => m.PagesModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}