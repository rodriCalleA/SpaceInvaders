import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['../shared/css/app.common.css' ,'./preferences.component.css'],
})
export class PreferencesComponent implements OnInit{ 

  ufoNumber: number = 1;
  ufoNumberOptions: number[] = [1,2,3,4,5];
  timeSeconds: number = 60;
  timeSecondsOptions: number[] = [60, 120, 180];
  background: boolean = true;
  sounds: boolean = true;

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
    this.getData();
  }

  onChange(){
    let preferences = {
      ufoNumber: this.ufoNumber,
      timeSeconds: this.timeSeconds,
      background: this.background,
      sounds: this.sounds
    }
    localStorage.setItem('preferences', JSON.stringify(preferences));
    this.toastr.success('Preferences saved', '');
  }

  private getData() {

    if (typeof (Storage) !== 'undefined') {
      let preferences = localStorage.getItem('preferences');
      if (preferences != null) {
        let parsedPreferences = JSON.parse(preferences);
        this.ufoNumber = parseInt(parsedPreferences.ufoNumber);
        this.timeSeconds = parseInt(parsedPreferences.timeSeconds);
        this.background = parsedPreferences.background;
        this.sounds = parsedPreferences.sounds;
      }
  
    } else {
      alert('Sorry, your browser does not support local storage.');
    }
  }

}
