import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShoppingListRoutingModule } from 'src/app/shared/router/shopping-list-routing.module';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [CommonModule, FormsModule, SharedModule, ShoppingListRoutingModule],
  // No need to export these components since they are not used outside of this module. (Because of ShoppingListRoutingModule.)
  //exports: [ShoppingListComponent, ShoppingEditComponent],
})
export class ShoppingListModule {}
