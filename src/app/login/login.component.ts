import { AuthService } from './../shared/services/auth.service';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginSubscription: Subscription = Subscription.EMPTY;
  error;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const val = this.loginForm.value;
    if (val.username && val.password) {
      this.loginSubscription = this.authService.login(val.username, val.password)
        .subscribe(
          (any) => {
            if (any['error']){
              this.error= any['error']
            } else{
              this.router.navigateByUrl('');
                    }
          },
          (error) => {
            this.error = error;
          }
        );
    }
  }
  ngOnInit() {

  }
  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
