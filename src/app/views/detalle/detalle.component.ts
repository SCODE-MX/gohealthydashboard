/// <reference types="stripe-checkout"/>
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { DatabaseService } from 'src/app/services/database.service';
import { StripeService } from 'src/app/services/stripe.service';
import { NoCardPopupComponent } from 'src/app/shared/no-card-popup/no-card-popup.component';
import { SubscribePopupComponent } from 'src/app/shared/subscribe-popup/subscribe-popup.component';
import { environment } from 'src/environments/environment';

import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { normalizeString } from '../../models/functions/general.functions';
import { ChartType, DirectorioI } from '../../models/interfaces/general.interfaces';

declare var StripeCheckout: StripeCheckoutStatic;

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  data: any;
  form: FormGroup;
  visitas: any;
  contactos: any;
  barScheme = {
    domain: ['#3a7458', '#28795c',  '#287478', '#284677', '#25416f', '#213f64', '#58205f', '#342163', '#002548']
  };
  mujeres_visitas: ChartType[];
  mujeres_contactos: ChartType[];
  hombres_visitas: ChartType[];
  hombres_contactos: ChartType[];
  newImg: File[];
  delImg: string[];
  tempUrl: string[];
  tempRef: string[];
  imgValid = true;

  handler: StripeCheckoutHandler;
  loading = false;
  confirmation: any;

  constructor(
    // private storage: StorageService,
    private stripe: StripeService,
    private service: DatabaseService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog
    ) {
      this.form = this.fb.group({
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        telefono: ['', Validators.compose([Validators.pattern(/^[0-9]{8,10}/), Validators.required])],
        direccion: ['', Validators.required],
        horario: ['', Validators.required],
        latitud: ['', Validators.compose([Validators.pattern(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/), Validators.required])],
        longitud: ['', Validators.compose([Validators.pattern(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/), Validators.required])],
        correo: ['', Validators.compose([Validators.required, Validators.email])],
        sitio_web: '',
        facebook: '',
      });
      this.route.paramMap.subscribe(params => {
        console.log(params);
        if (params.has('id') && params.has('estado')) {
          const estado = params.get('estado');
          const id = params.get('id');
          console.log('data from dash', {estado, id});
          this.service.getDocumentData<DirectorioI>(`Directorio/Estados/${estado}/`, id).subscribe( (res) => {
            console.log('gettin data in detail', {res});
            this.data = res;
            this.form.patchValue(this.data);
            this.tempRef = this.data.refFotos;
            this.tempUrl = this.data.urlFotos;
            this.visitas = this.sumByName(this.data, 'visitas_');
            this.contactos = this.sumByName(this.data, 'contactos_');
            this.hombres_visitas = this.arrChartType(this.data, 'visitas_h_');
            this.hombres_contactos = this.arrChartType(this.data, 'contactos_h_');
            this.mujeres_contactos = this.arrChartType(this.data, 'contactos_m_');
            this.mujeres_visitas = this.arrChartType(this.data, 'visitas_m_');
          });
        } else {
          this.router.navigate(['blog']);
        }
      });
  }

  ngOnInit() {
    this.handler = StripeCheckout.configure({
      key: environment.stripe.key,
      locale: 'es',
      currency: 'mxn',
      allowRememberMe: false,
      source: async (source) => {
        this.loading = true;
        this.confirmation = await this.stripe.attachSource(source.id).toPromise();
        this.loading = false;
      }
    });
  }
  added(event) {
    console.log('from added', event);
    this.newImg = event;
  }
  deleted(event) {
    console.log('from deleted', event);
    this.delImg = event;
  }
  urlResult(event) {
    console.log('from urlResult', event);
    this.tempUrl = event;
  }
  refResult(event) {
    console.log('from redResult', event);
    this.tempRef = event;
  }
  validPhotos(event) {
    console.log('img is valid?', event);
    this.imgValid = event;
  }

  async save(): Promise<void> {
    console.log('data', {...this.data});
    const promiseArray: Promise<any>[] = [];
    if (this.delImg) {
      console.log('hay imagenes para eliminar aquí se deben eliminar las fotos ref->', this.delImg);
      // tambien se deben actualizar los archivos temporales
      this.delImg.forEach(path => {
        console.log('Path for each deleted img', path);
        promiseArray.push(this.service.deletePhoto(path));
      });
      await Promise.all(promiseArray).then(() => {
        this.toastr.success('El cambio de fotos se ha realizado exitosamente', 'Actualización');
      })
      .catch(err => {
        this.toastr.error(err.message, 'Error');
        console.error(err);
      });
    }
    // despues de cumplir las promesas de guardado o de eliminado si es que hay, aquí se actualizan los arrays de ref y url
    // y se actualiza el documento
    if (this.form.valid && this.data) {
      const finalForm = {
        ...this.data,
        ...this.form.value,
      };
      console.log({...this.form.value});
      this.service.update(`Directorio/Estados/${normalizeString(finalForm.estado)}/`, finalForm, finalForm.id, this.newImg)
      .then(() => {
        this.toastr.success('La operación se ha realizado exitosamente', 'Guardado');
      })
      .catch(err => {
        this.toastr.error(err.message, 'Error');
        console.error(err);
      });
    }
  }
  sumByName(obj: Object, name: string): number {
    let acc = 0;
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && key.includes(name)) {
             acc = acc + obj[key];
        }
    }
    return acc;
  }
  arrChartType(obj: Object, name: string): any[] {
    const arrayChatType: any[] = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && key.includes(name)) {
        arrayChatType.push({name: key.slice(name.length, key.length).replace('_', '-'), value: obj[key]});
      }
    }
    return arrayChatType;
  }

  async setAdVisibleState(value: boolean): Promise<void> {
    try {
      const {estado, id} = this.data;
      // TODO: Add loader while performing the update
      await this.service.update(`Directorio/Estados/${normalizeString(estado)}/`, {visible: value}, id);
      this.data.visible = value;
    } catch (error) {
      alert('Hubo un error con la base de datos');
    }
  }

  onDeactivateAd() {
    return this.setAdVisibleState(false);
  }

  async onActivateAd(event) {
    // Check if we need to add a credit card
    // const plan = await this.stripe.user$.pipe(take(1)).toPromise();
    // if (plan.status = 'ACTIVO') {
    //   return this.setAdVisibleState(true);
    // }

    // Open dialog if user doesn't have registered a card
    // this.openNoCardPopUp(event);
    this.loading = true;
    const cards = await this.stripe.getSources().pipe(first()).toPromise();
    this.loading = false;

    if (cards.length === 0) {
      this.openNoCardPopUp(event);
    }
    console.log('cards :', cards);
    this.openSubscribePopUp(event);
  }

  openSubscribePopUp(event): void {
    const dialogRef = this.dialog.open(SubscribePopupComponent, {
      width: '400px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('result :', result);
    });
  }

  openNoCardPopUp(event): void {
    const dialogRef = this.dialog.open(NoCardPopupComponent, {
      width: '400px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('result :', result);
      if (result === 'addCard') {
        this.checkout(event);
      }
    });
  }

  // Open the checkout handler
  async checkout(event) {
    const user = await this.stripe.getUser();
    this.handler.open({
      name: 'Registro de tarjeta',
      description: 'Ingrese los datos su tarjeta',
      email: user.email,
      panelLabel: 'Agregar Tarjeta'
    });
    event.preventDefault();
  }

  // Close on navigate
  @HostListener('window:popstate')
  onPopState() {
    this.handler.close();
  }

}
