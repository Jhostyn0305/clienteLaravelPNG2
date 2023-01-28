import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AutenticacionService {
    baseUrl: string = "http://127.0.0.1:8000/api/auth/";
    constructor(
        private http: HttpClient
    ) { }

    logout(): Observable<any> {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        const token = sessionStorage.getItem('token');
        httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
        return this.http.post(this.baseUrl + "logout", {
            headers: httpHeaders,
            observe: 'response'
        })
    }


}
