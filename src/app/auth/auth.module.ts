import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSharedModule } from '../ui-shared/ui-shared.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthRoutingModule } from './auth.routes';
import { UppercaseDirective } from '../directives/shared/uppercase.directive';
import { OnlyNumbersDirective } from '../directives/shared/only-numbers.directive';



@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
    UiSharedModule,
    AuthRoutingModule,
    UppercaseDirective,
    OnlyNumbersDirective
  ]
})
export class AuthModule { }
