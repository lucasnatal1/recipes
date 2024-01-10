import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { CustomAlertComponent } from './components/custom-alert/custom-alert.component';
import { DropdownDirective } from './directives/dropdown.directive';
import { PlaceholderDirective } from './directives/placeholder.directive';
import { FilterPipe } from './pipes/filter.pipe';
import { SortPipe } from './pipes/sort.pipe';

@NgModule({
  declarations: [
    DropdownDirective,
    FilterPipe,
    SortPipe,
    CustomAlertComponent,
    ConfirmModalComponent,
    PlaceholderDirective,
  ],
  imports: [CommonModule],
  exports: [
    DropdownDirective,
    FilterPipe,
    SortPipe,
    CustomAlertComponent,
    ConfirmModalComponent,
    PlaceholderDirective,
  ],
})
export class SharedModule {}
