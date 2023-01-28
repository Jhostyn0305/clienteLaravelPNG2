import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { IResponse } from '../../model/iresponse';
import { AutenticacionService } from 'src/app/services/autenticacion.service';
import { AsistenciaService } from 'src/app/services/asistencias.service';
import { IAsistencia } from 'src/app/model/iasistencia';


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})

export class EmpleadosComponent implements OnInit, OnDestroy {
  asistencias?: IAsistencia[];
  subRef$?: Subscription;
  constructor(
    private asistenciaService: AsistenciaService,
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.asistenciaService.getAllAsistenciasByUser()
      .subscribe(res => {
        if (res.body !== null) {
          console.log(res.body);
          this.asistencias = res.body['asistencia'];
        }
      }, err => {
        console.log('Error al recuperar los datos', err);
      });
  }

  insertEntrada() {
    const entrada: IAsistencia = {
      id: 0,
      accion: 'Entró',
      tipo: '1',
      fecha_ejecucion: new Date,
      empleado_id: '0',
      created_at: new Date,
      updated_at: new Date
    };
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const token = sessionStorage.getItem('token');
    httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    this.subRef$ = this.http.post<IResponse>('http://127.0.0.1:8000/api/postInsertAsistencia', entrada, {
      headers: httpHeaders,
      observe: 'response'
    })
      .subscribe(res => {
        if (res.body !== null) {
          if (res.body.status != 403) {
            Swal.fire({
              title: '¡Registro Existoso!',
              text: '¡Entrada registrada!',
              icon: 'success',
              confirmButtonText: 'Cool'
            })


            this.asistenciaService.getAllAsistenciasByUser()
              .subscribe(res => {
                if (res.body !== null) {
                  console.log(res.body);
                  this.asistencias = res.body['asistencia'];
                }
              }, err => {
                console.log('Error al recuperar los datos', err);
              });

          }
          this.router.navigate(['/empleado']);
        }
      }, err => {
        Swal.fire({
          title: '¡Error!',
          text: err.error.message,
          icon: 'error',
          confirmButtonText: 'Cool'
        })
        console.log('ERROR EN EL LOGIN', err);
      });
  }



  insertSalida() {
    const entrada: IAsistencia = {
      id: 0,
      accion: 'Salió',
      tipo: '1',
      fecha_ejecucion: new Date,
      empleado_id: '0',
      created_at: new Date,
      updated_at: new Date
    };
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const token = sessionStorage.getItem('token');
    httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    this.subRef$ = this.http.post<IResponse>('http://127.0.0.1:8000/api/postInsertAsistencia', entrada, {
      headers: httpHeaders,
      observe: 'response'
    })
      .subscribe(res => {
        if (res.body !== null) {
          if (res.body.status != 403) {
            Swal.fire({
              title: '¡Registro Existoso!',
              text: '¡salida registrada!',
              icon: 'success',
              confirmButtonText: 'Cool'
            })
            this.asistenciaService.getAllAsistenciasByUser()
              .subscribe(res => {
                if (res.body !== null) {
                  console.log(res.body);
                  this.asistencias = res.body['asistencia'];
                }
              }, err => {
                console.log('Error al recuperar los datos', err);
              });
          }
          this.router.navigate(['/empleado']);
        }
      }, err => {
        Swal.fire({
          title: '¡Error!',
          text: err.error.message,
          icon: 'error',
          confirmButtonText: 'Cool'
        })
        console.log('ERROR EN EL LOGIN', err);
      });
  }




  ngOnDestroy() {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }
}