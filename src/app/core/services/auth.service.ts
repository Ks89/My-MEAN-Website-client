import { EventEmitter, Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {
  public loginEvent: EventEmitter<any> = new EventEmitter();

  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  constructor(private http: Http) {}

  // ----------------------------------------------------------
  // ------------------ local authentication ------------------
  // ----------------------------------------------------------

  login(user: any): Observable<any> {
    return this.http.post('/api/login', user, this.options)
      .map(response => {
        console.log(response);
        if (!response || !response.json()) {
          return Observable.throw(new Error('response body is empty'));
          // return this.handleError('response body is empty');
        } else {
          this.saveToken('auth', response.json().token);
          return response.json();
        }
      }).catch(error => {
        this.removeToken('auth');
        return this.handleError(error);
      });
  }

  register(user: any): Observable<any> {
    return this.http.post('/api/register', user, this.options)
      .map(response => {
        console.log('Done register, response is:');
        console.log(response);
        return response;
      }).catch(error => {
        this.removeToken('auth');
        return this.handleError(error);
      });

  }

  reset(emailToken: any, newPassword: any): Observable<any> {
    let data = {
      newPassword: newPassword,
      emailToken: emailToken
    };
    return this.http.post('/api/resetNewPassword', data, this.options)
      .map(response => {
        this.removeToken('auth'); // TODO check if it's correct to remove or I have to save it
        return response.json();
      }).catch(this.handleError);
  }

  forgot(email: any): Observable<any> {
    return this.http.post('/api/reset', {email: email}, this.options)
      .map(response => response.json())
      .catch(this.handleError);
  }

  activate(emailToken: string, userName: string): Observable<any> {
    let data = {
      emailToken: emailToken,
      userName: userName
    };
    return this.http.post('/api/activateAccount', data, this.options)
      .map(response => response.json())
      .catch(this.handleError);
  }

  unlink(serviceName: string): Observable<any> {
    console.log('Called unlink ' + serviceName);
    return this.http.get(`/api/unlink/${serviceName}`)
      .catch(this.handleError);
  };

  // ---------------------------------------
  // --- local and 3dauth authentication ---
  // ---------------------------------------
  // function to call the /users/:id REST API
  getUserById(id: string): Observable<any> {
    return this.http.get(`/api/users/${id}`)
      .map(response => response.json())
      .catch(this.handleError);
  };

  logout(): Observable<any> {
    console.log('Called authentication logout');
    this.removeToken('auth');

    // call REST service to remove session data from redis
    return this.http.get('/api/logout')
      .map(response => response.json())
      .catch(this.handleError);
  }

  saveToken(key: any, token: any) {
    console.log('saving token with key: ' + key);
    window.sessionStorage.setItem(key, token);
  };

  getTokenRedis(): Observable<any> {
    return this.http.get('/api/sessionToken')
      .map(response => response.json())
      .catch(this.handleError);
  }

  decodeJwtToken(jwtToken: string): Observable<any> {
    // TODO add an if (jwtToken) or something like that
    return this.http.get(`/api/decodeToken/${jwtToken}`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  // For 3dauth I must save the auth token, before that I can call isLoggedIn.
  // Obviously, with local auth I can manage all the process by myself, but for 3dauth after the callback
  // I haven't anything and I must call this method to finish this process.
  post3dAuthAfterCallback(): Observable<any> {
    return this.getTokenRedis()
      .map(tokenData => {
        console.log('token obtained from redis');
        console.log('sessionToken ');
        console.log(tokenData);
        if (!tokenData) {
          return 'sessionToken not valid';
        }

        // FIXME this could be a bug because in unit-test I have to stringify two times. Why?
        const tokenObj = JSON.parse(tokenData);
        console.log('tokenobj: ' + tokenObj);
        if (tokenObj && tokenObj.token) {
          console.log('real token is: ' + tokenObj.token);
          this.saveToken('auth', tokenObj.token);
          return tokenObj.token;
        } else {
          return 'sessionToken not valid. Cannot obtain token';
        }
      })
      .catch(this.handleError);
  }

  // Used to know if you are logged in or not
  getLoggedUser(): Observable<any> {
    console.log('getLoggedUser entered');
    return this.getUserFromSessionStorage('auth')
      .map(res => {
        console.log('getLoggedUser map res entered');
        console.log(res);
        if (res === null || res === 'invalid-data') {
          console.log('getLoggedUser invalid');
          this.removeToken('auth');
          console.log('INVALID DATA !!!!');
          //  return Observable.throw(new Error('Invalid data!'));
          return 'INVALID DATA';
        } else {
          console.log('getLoggedUser valid');
          const userData = JSON.parse(res);
          console.log(userData);
          const user = userData.user;
          console.log(user);
          return user;
        }
      })
      .catch(this.handleError);
  }

  // -----------------------------------
  // --- others functions - not exposed
  // -----------------------------------
  getToken(key: any): string {
    const sessionAuth: string | void = window.sessionStorage.getItem(key);

    if (!sessionAuth || sessionAuth === 'undefined' || sessionAuth === 'null') {
      return undefined;
    }

    return sessionAuth;
  }

  removeToken(key: any) {
    window.sessionStorage.removeItem(key);
  }

  // it uses the sessionStorage's jwt token as parameter of decodeJwtToken rest service
  // to be able to return the decoded json user
  private getUserFromSessionStorage(key: string): Observable<any> {
    console.log('getUserFromSessionStorage called method');
    console.log('sessionStorage: ');
    console.log(this.getToken(key));
    const sessionToken = this.getToken(key);
    if (sessionToken) {
      console.log('getUserFromSessionStorage sessionToken ' + sessionToken);
      return this.decodeJwtToken(sessionToken);
    } else {
      console.log('getUserFromSessionStorage sessionToken null or empty');
      // FIXME find a better solution
      return Observable.of(null);
    }
  }

  private handleError(error: any) {
    // TODO In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(new Error(errMsg));
  }
}



