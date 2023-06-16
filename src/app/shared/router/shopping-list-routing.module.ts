import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingListComponent } from 'src/app/components/shopping-list/shopping-list.component';
import { AuthGuard } from 'src/app/components/auth/auth.guard';

const shoppingListRoutes: Routes = [
    { path: '', component: ShoppingListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(shoppingListRoutes)],
  exports: [RouterModule],
})
export class ShoppingListRoutingModule {}
