import {RecordsRestService} from '../shared/services/records-rest.service';
import { Record } from '../shared/model/app.record';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['../shared/css/app.common.css', './records.component.css'],
})
export class RecordsComponent implements OnInit{ 
  globalRecords: Record[] = [];
  userRecords: Record[] | null = null;
  username: string = '';
  confirmationDialogVisible: boolean = false;
  loading: boolean = true;

  constructor(private conex: RecordsRestService, private auth: AuthService, private toastr: ToastrService ) { }

  ngOnInit() {
    this.getRecords();

    const authorization = this.auth.getLocalAuthorization() || { username: null };
    this.username = authorization.username;
  }

  getRecords() {
    this.conex.getRecords().subscribe((value: any) => {
      setTimeout(() => {
        this.globalRecords = value;
        this.loading = false;
      }, 1500);
    });

    this.conex.getRecordsByUserName()?.subscribe((value: Record[]) => {
      setTimeout(() => {
        this.userRecords = value.length > 0 ? value : null;
        this.loading = false;
      }, 1500);
    });
  }

  removeRecords() {
    this.conex.deleteUserRecords()!.subscribe(
      (data) => {
        this.toastr.success('Records deleted', '');
        this.userRecords = null;
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error, 'Error');
      }
    );
  }

  showConfirmationDialog() {
    this.confirmationDialogVisible = true;
  }

  hideCOonfirmationDialog() {
    this.confirmationDialogVisible = false;
  }

  confirmationDialogEvent(event: Event){
    if(event){
      this.removeRecords();
    }
    this.hideCOonfirmationDialog();
  }

}
