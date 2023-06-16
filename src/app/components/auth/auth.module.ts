import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: AuthComponent }]),
  ],
})
export class AuthModule {}
