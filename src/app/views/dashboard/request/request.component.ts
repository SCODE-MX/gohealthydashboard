import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  form: FormGroup;
  pre: 'Hola, necesito un nuevo anuncio con los siguientes detalles: <br> Nombre: <br> Dirección: <br> Teléfono: <br> Correo electrónico:';
  // Horario:
  // Latitud:
  // Longitud:
  // Facebook:
  // Sitio Web:
  // Descripción:'
  constructor(
    public dialogRef: MatDialogRef<RequestComponent>,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      mensaje: ['Hola, necesito un nuevo anuncio con los siguientes detalles: \n Nombre: \n Dirección: \n Teléfono: \n Correo electrónico: \n Horario: \n Latitud: \n Longitud: \n Facebook: \n Sitio Web: \n Descripción:'],
    });
  }

  ngOnInit() {
  }
  send() {
    // console.log('form', this.form.value);
    this.dialogRef.close(this.form.value);
  }

}
