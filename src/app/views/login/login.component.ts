import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private  router: Router, private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      // state: ['Yucatán', Validators.required],
    }
    );
   }

  ngOnInit() {}

  login() {
    console.log('this.loginForm.valid', this.loginForm.valid);
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      // const state = this.loginForm.value.state;
      console.log('login', email, password);
      this.authService.login(email, password).then(res => {
        console.log(res);
        this.toastr.success('Se ha iniciado sesión correctamente', 'Iniciando sesión');
        this.router.navigate(['/dashboard']);
        // console.log(res);
      }).catch(err => {
        this.toastr.error('Hubo un problema al momento de iniciar sesión', 'Error');
        console.error(err);
        // Swal.fire('Error en iniciar sesión', err.message, 'error');
      });
    }
  }

  // resetPassword() {
  //   this.modal.fire({
  //     title: 'Escribe tu correo electrónico',
  //     input: 'text',
  //     inputAttributes: {
  //       autocapitalize: 'off'
  //     },
  //     showCancelButton: true,
  //     confirmButtonText: 'Enviar correo',
  //     allowOutsideClick: () => !this.modal.isLoading()
  //   }).then((result) => {
  //     console.log(result);
  //     if (result.value) {
  //       this.authService.resetPasswordInit(result.value).then( res => {
  //         this.modal.fire(
  //          '¡Tu correo ha sido enviado!',
  //           'El correo electrónico con las instrucciones para reestablecer tu contraseña ha sido enviado a tu correo electrónico'
  //         );
  //       }).catch( err => {
  //         console.error(err);
  //         this.modal.fire('Error', err.message, 'error');
  //       });
  //     }
  //   }).catch( err => this.modal.fire('Error', err, 'error') );
  // // this.authService.resetPasswordInit()
  // }

}
