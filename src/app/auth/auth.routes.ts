import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {
        path: 'register', 
        component: SignInComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AuthRoutingModule {}