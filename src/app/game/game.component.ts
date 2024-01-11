import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { RecordsRestService } from '../shared/services/records-rest.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['../shared/css/app.common.css', './game.component.css'],
})
export class GameComponent implements OnInit, AfterViewInit {
  //@ViewChild('clock-back') clockElement!: ElementRef;
  @ViewChild('missile') missile!: ElementRef;
  @ViewChild('explosion') explosion!: ElementRef;
  @ViewChildren('ufo') query!: QueryList<ElementRef>;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    event.preventDefault();
    if (!this.missileLaunch && this.inGame) {
      switch (event.key) {
        case 'ArrowRight':
          this.moveMissileRight();
          break;
        case 'ArrowLeft':
          this.moveMissileLeft();
          break;
        case ' ':
          this.pullTrigger();
          break;
      }
    }
  }

  score: number = 0;
  time: string = '';
  nUfos: number = 0;
  startMenuVisible: boolean = true;
  startMenuAnimation: string = '';
  backgroundIMGAnimation: string = '';
  backgroundIMGInvertedAnimation: string = '';
  blinkAnimation: string = '';
  timeAndPointsVisible: boolean = false;
  gameContainerVisible: boolean = false;
  puntuation: number = 0;
  gameOverView: boolean = false;
  ufosVisible: number[] = [];
  countdownTime: number = 60;
  isLogged: boolean = false;
  background: boolean = true;

  private inGame: boolean = false;
  private missileLaunch: boolean = false;
  private intervalId: any = null;
  private currentTime: number = 0;
  private hstep: number = 20;
  private UFOs: ElementRef[] = [];
  private sounds: boolean = false;
  private pid: any = null;
  private soundExplosion = new Audio('../../assets/sounds/explosion.wav');

  constructor(
    private auth: AuthService,
    private recordsService: RecordsRestService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const preferencesString = localStorage.getItem('preferences');
    if (preferencesString !== null) {
      const preferences = JSON.parse(preferencesString);
      this.countdownTime = this.currentTime = parseInt(preferences.timeSeconds);
      this.time = this.currentTime + 's';
      this.nUfos = parseInt(preferences.ufoNumber);
      this.background = preferences.background;
      this.sounds = preferences.sounds;
    } else {
      this.countdownTime = this.currentTime = 60;
      this.nUfos = 3;
      this.background = false;
      this.sounds = false;
    }

    for (let i = 0; i < this.nUfos; i++) {
      this.ufosVisible.push(i);
    }
  }

  ngAfterViewInit() {
    this.query.changes.subscribe((items: QueryList<ElementRef>) => {
      this.UFOs = items.toArray();
    });
  }

  startGame() {
    this.backgroundIMGAnimation = 'animateBottom';
    this.backgroundIMGInvertedAnimation = 'animateTop';
    this.startMenuAnimation = 'animateFade';

    if (this.background) {
      //generateStars();
    }
    setTimeout(() => {
      this.startMenuVisible = false;
      this.startGameLoop();
    }, 1000);
  }

  startGameLoop() {
    this.gameContainerVisible = true;

    setTimeout(() => {
      this.timeAndPointsVisible = true;
      this.intervalId = setInterval(() => this.updateClock(), 1000);
      this.inGame = true;
    }, 3000);
  }

  updateClock() {
    const percentage =
      ((this.countdownTime - this.currentTime) / this.countdownTime) * 100;
    //clockElement.style.width = percentage + '%';
    this.time = this.currentTime + 's';
    this.currentTime--;

    if (this.currentTime < 0) {
      clearInterval(this.intervalId);
      this.gameOver();
    }
  }

  gameOver() {
    this.puntuation = this.score / (this.countdownTime / 60) - this.nUfos * 50;
    this.inGame = false;
    this.isLogged = this.auth.getLocalAuthorization() != null;
    if (this.isLogged) {
      this.recordsService
        .postUserRecords({
          punctuation: this.puntuation,
          ufos: this.nUfos,
          disposedTime: this.countdownTime,
        })!
        .subscribe(
          (data) => {
            this.toastr.success('Record saved', '');
          },
          (error) => {
            console.log(error);
            this.toastr.error(error.error, 'Error');
          }
        );
    }
    this.gameOverView = true;
  }

  saveScore() {
    sessionStorage.setItem(
      'score',
      JSON.stringify({
        punctuation: this.puntuation,
        ufos: this.nUfos,
        disposedTime: this.countdownTime,
      })
    );
  }

  moveMissileRight() {
    let rLimit = window.innerWidth;
    let hpos_m = parseInt(
      this.missile.nativeElement.getBoundingClientRect().left
    );
    let misWidth = parseInt(this.missile.nativeElement.offsetWidth);

    if (hpos_m + misWidth + this.hstep < rLimit) {
      this.missile.nativeElement.style.left = hpos_m + this.hstep + 'px';
    }
  }

  moveMissileLeft() {
    let hpos_m = parseInt(
      this.missile.nativeElement.getBoundingClientRect().left
    );

    if (hpos_m - this.hstep >= 0) {
      this.missile.nativeElement.style.left = hpos_m - this.hstep + 'px';
    }
  }

  pullTrigger() {
    this.missileLaunch = true;
    this.pid = setInterval(() => {
      this.launch();
    }, 10);
  }

  checkForHitUFO(ufo: ElementRef, i: number) {
    let posUFO = ufo.nativeElement.getBoundingClientRect();
    let left_ufo = parseInt(posUFO.left);
    let top_ufo = parseInt(posUFO.top);
    let right_ufo = parseInt(posUFO.right);
    let bottom_ufo = parseInt(posUFO.bottom);
    let posMissile = this.missile.nativeElement.getBoundingClientRect();
    let left_m = parseInt(posMissile.left);
    let top_m = parseInt(posMissile.top);
    let right_m = parseInt(posMissile.right);
    let bottom_m = parseInt(posMissile.bottom);

    if (
      bottom_ufo >= top_m &&
      top_ufo <= bottom_m &&
      right_ufo >= left_m &&
      left_ufo <= right_m
    ) {
      return true;
    }

    return false;
  }

  checkForHit() {
    for (let i = 0; i < this.UFOs.length; i++) {
      if (this.checkForHitUFO(this.UFOs[i], i)) {
        return true;
      }
    }
    return false;
  }

  launch() {
    var uLimit = window.innerHeight;
    var vpos_m: string | number = 0;
    var vstep = 5;

    if (this.checkForHit()) {
      this.missileLaunch = false;
      clearInterval(this.pid);
      vpos_m = 0;
      this.score += 100;
      if (this.sounds) {
        this.soundExplosion.play();
      }

      let l = parseInt(this.missile.nativeElement.getBoundingClientRect().left);
      let b =
        parseInt(this.missile.nativeElement.style.bottom) +
        parseInt(this.missile.nativeElement.offsetHeight) / 2;

      this.explosion.nativeElement.style.bottom = b + 'px';
      this.explosion.nativeElement.style.left = l + 'px';
      this.explosion.nativeElement.style.display = 'block';
      this.missile.nativeElement.style.display = 'none';

      setTimeout(() => {
        this.explosion.nativeElement.style.display = 'none';
        this.missile.nativeElement.style.animation = 'none';
        this.missile.nativeElement.style.display = 'block';
        this.missile.nativeElement.style.bottom = vpos_m + 'px';
      }, 1000);
    } else {
      vpos_m = parseInt(this.missile.nativeElement.style.bottom);
      vpos_m = vpos_m ? vpos_m : 10;
      if (vpos_m < uLimit) {
        vpos_m += vstep;
      } else {
        this.score -= 25;
        this.missileLaunch = false;
        clearInterval(this.pid);
        vpos_m = 10;
      }
      this.missile.nativeElement.style.bottom = vpos_m + 'px';
    }
  }

  private positions: string[] = [];
  randomLeftPosition(i: number) {
    if (this.positions.length == 0) {
      for (let i = 0; i < 25; i++) {
        this.positions.push(`left: ${Math.random() * window.innerWidth}px; animation-delay: ${Math.random()*6}s;`);
      }
    } 
    return this.positions[i];
  }

}
