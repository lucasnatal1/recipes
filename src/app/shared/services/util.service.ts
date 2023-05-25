import { Injectable, ViewContainerRef } from '@angular/core';

import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component';

@Injectable({ providedIn: 'root' })
export class UtilService {
  constructor() {}

  showConfirm(title: string, message: string, container: ViewContainerRef) {
    container.clear();

    const componentRef = container.createComponent(ConfirmModalComponent);

    componentRef.instance.title = title;
    componentRef.instance.message = message;
    return componentRef.instance.responseEvent;
  }

  showAlert(success: boolean, message: string, container: ViewContainerRef) {
    container.clear();

    const componentRef = container.createComponent(CustomAlertComponent);
    
    componentRef.instance.success = success;
    componentRef.instance.alertMessage = message;
    return componentRef.instance.timeOutEvent;
  }
}
