import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewContainerRef, ViewChild, TemplateRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;
confData =  {
  message: 'Se enviará un un link para restablecer la contraseña al siguiente correo:',
  email: '',
  question: '¿Deseas continuar?'
}
@ViewChild('confirmation', {static: false}) dialogRef: TemplateRef<any>;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private  router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService) {
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

  resetPassword() {
    const email = this.loginForm.value.email;
      if (!!email && this.loginForm.get('email').valid) {
        this.authService.resetPasswordInit(email).then( res => {
          this.toastr.success(`Se ha enviado un link para reestablecer tu contraseña al siguiente correo: ${email}`, 'Enviado!');
        }).catch( err => {
          console.error(err);
          this.toastr.error(`Hubo un problema al momento de restablecer contraseña. Código: ${err.code}`, 'Error');
        });
      } else {
        this.toastr.warning('Verifica y/o llena el campo E-mail', 'Atención');
      }
  }

  openConfirmation() {
    const email = this.loginForm.value.email;
    if (!!email && this.loginForm.get('email').valid) {
      console.log('open request code');
      this.openDialog(email).then(result => {
        if (result) {
          console.log('from dialog', {result});
          this.resetPassword();
        }
      });
    } else {
      this.toastr.warning('Verifica y/o llena el campo E-mail', 'Atención');
    }
  }
  openDialog(email: string): Promise<any> {
    const options = { width: '50%', hasBackdrop: true, data: {...this.confData, email} };
    const dialogRef = this.dialog.open(this.dialogRef, options);
    return dialogRef.afterClosed().toPromise();
  }

  try() {
    this.toastr.success('Funciona', 'Éxito');
  }

}
