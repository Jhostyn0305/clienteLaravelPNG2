import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AsistenciaService {
    baseUrl: string = "http://127.0.0.1:8000/api/";
    constructor(
        private http: HttpClient
    ) { }

    getAllAsistenciasByUser(): Observable<any> {
        let httpHeaders: HttpHeaders = new HttpHeaders();
        const token = sessionStorage.getItem('token');
        httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
        return this.http.get(this.baseUrl + "getAllAsistenciasByUser", {
            headers: httpHeaders,
            observe: 'response'
        })
    }

}
