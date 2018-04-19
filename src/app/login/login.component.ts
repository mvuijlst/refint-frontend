import { AuthService } from './../shared/services/auth.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
      this.form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
    }
  login() {
    const val = this.form.value;

    if (val.username && val.password) {
        this.authService.login(val.username, val.password)
            .subscribe(
                (any) => {
                    console.log('User is logged in');
                    console.log(any);
                    this.router.navigateByUrl('persons');
                }
            );
    }
}
refreshToken(){
  console.log('in refresh');
  // this.authService.refreshToken()
  //   .subscribe(
  //     (user) => {
  //       console.log("token is refreshed");
  //     }
  //   );
}
  ngOnInit() {
  }

}
