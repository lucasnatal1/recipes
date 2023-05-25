import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { AuthResponseData, AuthService } from 'src/app/shared/services/auth.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { PlaceholderDirective } from 'src/app/shared/directives/placeholder.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  @ViewChild(PlaceholderDirective, { static: true })
  cmpHost!: PlaceholderDirective;
  alertSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password)
    }

    authObs.subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      (error) => {
        console.log(error);
        this.showAlert(false, error.message);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  showAlert(success: boolean, alertMessage: string) {
    const hostViewContainerRef = this.cmpHost.viewContainerRef;
    this.alertSubscription = this.utilService
      .showAlert(success, alertMessage, hostViewContainerRef)
      .subscribe(() => {
        hostViewContainerRef.clear();
      });
  }
}
