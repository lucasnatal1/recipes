import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  @ViewChild(PlaceholderDirective, { static: true })
  cmpHost!: PlaceholderDirective;
  alertSubscription!: Subscription;
  email: string;
  remember: boolean;

  constructor(
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router
  ) {
    this.setBgImageBody();
  }

  ngOnInit(): void {
    const userPref = this.authService.getUserPreferences();
    this.email = userPref?.email;
    this.remember = userPref?.remember;
  }

  setBgImageBody() {
    let rand = Math.floor(Math.random() * 5) + 1;
    const bodyClasses = document.body.classList;
    bodyClasses.add('bg-image-' + rand);
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const remember = form.value.rememberme;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password, remember);
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

  ngOnDestroy(): void {
    const bodyClasses = document.body.classList;
    for (let i=1; i<=5; i++) {
      bodyClasses.remove('bg-image-' + i);
    }
  }

  // modalSubscription!: Subscription;
  // resetPassword() {
  //   const hostViewContainerRef = this.cmpHost.viewContainerRef;

  //   this.modalSubscription = this.utilService
  //     .showConfirm(
  //       'RESET PASSWORD',
  //       'Are you sure you want to reset your password?',
  //       hostViewContainerRef
  //     )
  //     .subscribe((response: boolean) => {
  //       this.modalSubscription.unsubscribe();
  //       hostViewContainerRef.clear();
  //       if (response) {
  //         console.log("flu")
  //         this.authService.resetPassword("lucasanatal@gmail.com");
  //       }
  //     });
  // }
}
