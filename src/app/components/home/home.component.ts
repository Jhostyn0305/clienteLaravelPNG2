import { Component, OnInit, OnDestroy } from '@angular/core';
import { IEmpleado } from '../../model/iempleado';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { IResponse } from 'src/app/model/iresponse';
import Swal from 'sweetalert2';
import { Iregistro } from 'src/app/model/iregistro';
import { AutenticacionService } from 'src/app/services/autenticacion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  empleados?: IEmpleado[];
  formEmpleado: FormGroup;
  subRef$?: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private empleadoService: EmpleadoService,
    private autenticacionService: AutenticacionService,
    private http: HttpClient,
    private router: Router
  ) {
    this.formEmpleado = formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      rol: ['SELECCIONE EL ROL', Validators.required],
      password: ['', Validators.required],
      user_name: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.empleadoService.getAllEmpleados()
      .subscribe(res => {
        if (res.body !== null) {
          console.log(res.body);
          this.empleados = res.body['empleado'];
        }
      }, err => {
        console.log('Error al recuperar los datos', err);
      });
  }

  RegisterEmpleado() {

    const empleadoCreado: Iregistro = {
      nombre: this.formEmpleado.value.nombre,
      password: this.formEmpleado.value.password,
      user_name: this.formEmpleado.value.user_name,
      apellido: this.formEmpleado.value.apellido,
      fecha_nacimiento: this.formEmpleado.value.fecha_nacimiento,
      rol: this.formEmpleado.value.rol,
      cedula: this.formEmpleado.value.cedula,
      id: 0
    };
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const token = sessionStorage.getItem('token');
    httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    this.subRef$ = this.http.post<IResponse>('http://127.0.0.1:8000/api/postInsertEmpleado', empleadoCreado, {
      headers: httpHeaders,
      observe: 'response'
    })
      .subscribe(res => {
        if (res.body !== null) {
          if (res.body.status != 403) {
            this.empleadoService.getAllEmpleados()
              .subscribe(res => {
                if (res.body !== null) {
                  this.empleados = res.body['empleado'];
                }
              }, err => {
                console.log('Error al recuperar los datos', err);
              });
            Swal.fire({
              title: '¡Registro Existoso!',
              text: '¡El Empleado ha sido registrado!',
              icon: 'success',
              confirmButtonText: 'Cool'
            })

          }

          this.router.navigate(['/home']);
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

  Logout() {
    this.autenticacionService.logout()
      .subscribe(res => {
        if (res.body !== null) {
          Swal.fire({
            title: '¡Vuelve Pronto!',
            text: '¡Usuario ha dejado la sesión!',
            icon: 'success',
            confirmButtonText: 'Cool'
          })
        }
      }, err => {
        console.log('Error al recuperar los datos', err);
        Swal.fire({
          title: '¡Error!',
          text: err.error.message,
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      });
  }

  ngOnDestroy() {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }
}
