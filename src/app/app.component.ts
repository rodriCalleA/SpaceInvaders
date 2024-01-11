import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'practica2';
  logged: boolean = false;
  navBarClass: string = ""
  confirmationDialogVisible: boolean = false;
  constructor(private router: Router, private auth: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    this.auth.isLoggedObservable().subscribe((value: boolean) => {
      this.logged = value;
    });
    this.auth.getLocalAuthorization();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/game']);
    this.toastr.success('Logout successful', '');
  };

  showConfirmationDialog() {
    this.confirmationDialogVisible = true;
  }

  hideCOonfirmationDialog() {
    this.confirmationDialogVisible = false;
  }

  confirmationDialogEvent(event: Event){
    if(event){
      this.logout();
    }
    this.hideCOonfirmationDialog();
  }

  redirect(path: string) {
    this.router.navigate([path]);
  }

  navBar(){
    if(this.navBarClass == ""){
      this.navBarClass = "responsive";
    }else{
      this.navBarClass = "";
    }
  }
}
