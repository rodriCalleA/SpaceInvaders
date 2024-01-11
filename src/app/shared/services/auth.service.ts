import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../model/app.user';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ 
    providedIn: 'root'
})

export class AuthService {
    private isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor(private http: HttpClient) { }


    loginWithUserAndPassword(userName: string, password: string) {
        let url = `http://wd.etsisi.upm.es:10000/users/login?username=${userName}&password=${password}`;
        return this.http.get(url).pipe(
            tap(() => {
                this.isLogged.next(true);
            })
        );
    }

    registerUser(user: User) {
        let url = `http://wd.etsisi.upm.es:10000/users`
        const headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.post(url, user, { headers: headers });
    }

    getLocalAuthorization() {
        let authorization = localStorage.getItem('authorization');
        if (authorization != null) {
            let parsedAuthorization = JSON.parse(authorization);
            if (this.authTokenExpired(parsedAuthorization.time)) {
                this.isLogged.next(false);
                return null;
            }
            this.isLogged.next(true);
            return parsedAuthorization;
        } else {
            return null;
        }
    }

    isLoggedObservable(): Observable<boolean> {
        return this.isLogged.asObservable();
    }

    setLogged(logged: boolean) {
        this.isLogged.next(logged);
    }

    logout() {
        localStorage.removeItem('authorization');
        this.isLogged.next(false);
    }

    private authTokenExpired(date: number): boolean {
        return Math.abs((new Date()).getTime() - date) > 600000;
    }
}