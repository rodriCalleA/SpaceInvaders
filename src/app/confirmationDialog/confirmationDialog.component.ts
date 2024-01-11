import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './confirmationDialog.component.html',
  styleUrls: ['../shared/css/app.common.css' ,'./confirmationDialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent implements OnInit{
  @Input() title: string = "No Title";
  @Input() message: string = "No Message";
  @Output() eventResponse = new EventEmitter();
  constructor() {}

  sendEvent(data: boolean | null){
    this.eventResponse.emit(data);
  }

  ngOnInit() {
  }
}
