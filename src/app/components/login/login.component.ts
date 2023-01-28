import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ILogin } from '../../model/ilogin';
import { IResponse } from '../../model/iresponse';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  subRef$?: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router

  ) {
    this.formLogin = formBuilder.group({
      user_name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  Login() {
    const usuarioLogin: ILogin = {
      user_name: this.formLogin.value.user_name,
      password: this.formLogin.value.password,
    };

    this.subRef$ = this.http.post<IResponse>('http://127.0.0.1:8000/api/auth/login', usuarioLogin, { observe: 'response' })
      .subscribe(res => {
        if (res.body !== null) {
          const token = res.body.token;
          console.log('token received', res.body);
          sessionStorage.setItem('token', token);
          console.log('rol', res.body.type)
          if (res.body.type === 1) {

            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/empleado']);
          }
        }


      }, err => {
        Swal.fire({
          title: '¡Error!',
          text: '¡Error en el inicio de sesión!',
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
