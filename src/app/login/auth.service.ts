import {Injectable} from '@angular/core';
import {User} from './user.interface';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {combineChange} from '@angular/fire/compat/firestore';
import {ContentService} from "../content/content.service";
import {ContentComponent} from "../content/content.component";
import {initializeApp} from "firebase/app";
import {environment} from "../../environments/environment";
import {deleteToken, getMessaging} from "firebase/messaging";

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private token: null | string | undefined = null;

  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<{token: string}> {
    console.log(user);
    return this.http.post<{ token: string; }>('http://localhost:8081/auth', user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token);
            this.setToken(token);
          }
        )
      )
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string {
    return <string>this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!localStorage.getItem('auth-token');
  }

  revokeToken(){
    const firebaseApp = initializeApp(environment.firebase);
    const messaging = getMessaging(firebaseApp);
    deleteToken(messaging).then(r => {
      console.log("Token deleted")
    })
  }

  logout() {
    this.setToken(null);
    this.revokeToken()
    localStorage.removeItem('auth-token');
  }
}
