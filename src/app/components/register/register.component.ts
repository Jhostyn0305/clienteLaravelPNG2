import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUser } from '../../model/iuser';
import { IResponse } from '../../model/iresponse';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  formRegister: FormGroup;
  subRef$?: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router

  ) {
    this.formRegister = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      plan_id: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  Register() {
    const usuarioRegister: IUser = {
      name: this.formRegister.value.name,
      email: this.formRegister.value.email,
      password: this.formRegister.value.password,
      plan_id: this.formRegister.value.plan_id,
    };

    this.subRef$ = this.http.post<IResponse>('http://127.0.0.1:8000/api/auth/register', usuarioRegister, { observe: 'response' })
      .subscribe(res => {
        if (res.body !== null) {
          const token = res.body.message;
          this.router.navigate(['/login']);
        }


      }, err => {
        console.log('ERROR EN EL REGISTRAR', err);
      });
  }

  ngOnDestroy() {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }


}

