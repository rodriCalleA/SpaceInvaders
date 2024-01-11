import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecordsRestService } from '../shared/services/records-rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../shared/css/app.common.css', './login.component.css'],
})
export class LoginComponent implements OnInit {
  userName: string = '';
  password: string = '';
  validUser: boolean = false;
  userFieldClass: String[] = [];
  userErrorText: String = '';
  validPassword: boolean = false;
  passwordFieldClass: String[] = [];
  submitted: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService,
    private recordsService: RecordsRestService
  ) {}

  ngOnInit() {}

  checkUser(eventUser: any) {
    if (this.submitted) {
      let pattern = /^(?=.*[a-zA-Z].*[a-zA-Z])[a-zA-Z0-9]{3,}$/;
      if (this.submitted && eventUser != '' && !eventUser.match(pattern)) {
        this.userFieldClass = ['shake', 'error'];
        setTimeout(() => {
          this.userFieldClass.pop();
        }, 500);
        eventUser != ''
          ? (this.userErrorText = 'Enter a valid user name')
          : (this.userErrorText = "User can't be blank");
      } else {
        this.validUser = true;
        this.userFieldClass = ['valid'];
      }
    }
  }

  checkPassword(eventPass: any) {
    if (this.submitted) {
      if (eventPass == '') {
        this.validPassword = false;
        this.passwordFieldClass = ['shake', 'error'];
        setTimeout(() => {
          this.passwordFieldClass.pop();
        }, 500);
      } else {
        this.validPassword = true;
        this.passwordFieldClass = ['valid'];
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.checkUser(this.userName);
    this.checkPassword(this.password);

    if (this.validUser && this.validPassword) {
      this.auth
        .loginWithUserAndPassword(this.userName, this.password)
        .subscribe(
          (data) => {
            this.toastr.success('Logged in', '');
            const last = sessionStorage.getItem('score');
            if (last) {
              const record = JSON.parse(last.toString());
              this.recordsService.postUserRecords(record)!.subscribe(
                (data) => {
                  this.toastr.success('Last score saved', '');
                  sessionStorage.removeItem('score');
                },
                (error) => {
                  console.log(error);
                }
              );
            }
            this.router.navigate(['/game']);
          },
          (error) => {
            console.log(error);
            this.toastr.error(error.error, 'Error');
          }
        );
    }
  }
}
