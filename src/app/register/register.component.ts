import { Component, OnInit} from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/model/app.user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['../shared/css/app.common.css', './register.component.css'],
})
export class RegisterComponent implements OnInit{ 
  userName: string = '';
  email: string = '';
  password: string = '';
  repassword: string = '';

  validUser: boolean = false;
  userFieldClass: String[] = [];
  userErrorText: String = "";

  validEmail: boolean = false;
  emailFieldClass: String[] = [];
  emailErrorText: String = "";

  validPassword: boolean = false;
  passwordFieldClass: String[] = [];

  submitted: boolean = false;
  constructor(private router: Router, private toastr: ToastrService, private auth: AuthService) { }

  ngOnInit() {
  }

  checkUser(eventUser: any) {
    if(this.submitted){
      let pattern = /^(?=.*[a-zA-Z].*[a-zA-Z])[a-zA-Z0-9]{3,}$/;
      if(this.submitted && eventUser!="" && !eventUser.match(pattern)){
        this.userFieldClass = ["shake", "error"];
        setTimeout(()=>{
          this.userFieldClass.pop();
        }, 500);
        (eventUser != "") ? this.userErrorText = "Enter a valid user name" : this.userErrorText = "User can't be blank";
      }else{
        this.validUser = true;
        this.userFieldClass = ["valid"];
      }
    }
  }

  checkEmail(eventEmail: any){
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if(this.submitted){
      if(!eventEmail.match(pattern)){
        this.validEmail = false;
        this.emailFieldClass = ["shake", "error"];
        setTimeout(()=>{
          this.emailFieldClass.pop();
        }, 500);
        (eventEmail != "") ? this.emailErrorText = "Enter a valid email address" :this.emailErrorText = "Email can't be blank";
      }else{
        this.validEmail = true;
        this.emailFieldClass = ["valid"];
      }
    }
  }

  checkPassword(eventPass: any){
    if(this.submitted){
      if(eventPass == "" && this.password == this.repassword){
        this.validPassword = false;
        this.passwordFieldClass = ["shake", "error"];
        setTimeout(()=>{
          this.passwordFieldClass.pop();
        }, 500);
      }else{
        this.validPassword = true;
        this.passwordFieldClass = ["valid"];
      }
    }
  }


  onSubmit() {
    this.submitted = true;
    this.checkUser(this.userName);
    this.checkPassword(this.password);
    this.checkEmail(this.email);

    if(this.validUser && this.validPassword && this.validEmail){
      let user = new User(this.userName, this.email, this.password);
      this.auth.registerUser(user).subscribe(
        (data) => {
          this.toastr.success('Registered', '');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
          this.toastr.error(error.error, 'Error');
        }
      );
    }
  }
}
