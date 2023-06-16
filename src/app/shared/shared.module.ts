import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { CustomAlertComponent } from './components/custom-alert/custom-alert.component';
import { DropdownDirective } from './directives/dropdown.directive';
import { PlaceholderDirective } from './directives/placeholder.directive';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    DropdownDirective,
    FilterPipe,
    CustomAlertComponent,
    ConfirmModalComponent,
    PlaceholderDirective,
  ],
  imports: [CommonModule],
  exports: [
    DropdownDirective,
    FilterPipe,
    CustomAlertComponent,
    ConfirmModalComponent,
    PlaceholderDirective,
  ],
})
export class SharedModule {}
