/// <reference types="stripe-checkout"/>
import { ToastrService } from 'ngx-toastr';
import { first, take } from 'rxjs/operators';
import { DatabaseService } from 'src/app/services/database.service';
import { StripeService } from 'src/app/services/stripe.service';
import { NoCardPopupComponent } from 'src/app/shared/no-card-popup/no-card-popup.component';
import { SubscribePopupComponent } from 'src/app/shared/subscribe-popup/subscribe-popup.component';
import { environment } from 'src/environments/environment';

import { Component, HostListener } from '@angular/core';
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
export class DetalleComponent {
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

  public loading = false;
  private handler: StripeCheckoutHandler;

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
    this.loading = true;
    console.log('data', {...this.data});
    const promiseArray: Promise<any>[] = [];
    if (!!this.delImg) {
      console.log('hay imagenes para eliminar aquí se deben eliminar las fotos ref->', this.delImg);
      // tambien se deben actualizar los archivos temporales
      this.delImg.forEach(path => {
        console.log('Path for each deleted img', path);
        promiseArray.push(this.service.deletePhoto(path));
      });
      await Promise.all(promiseArray).then(() => {
        this.toastr.success('El cambio de fotos se ha realizado exitosamente', 'Actualización');
        this.delImg = [];
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
        this.newImg = [];
        this.loading = false;       })
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
      this.loading = true;
      await this.service.update(`Directorio/Estados/${normalizeString(estado)}/`, {visible: value}, id);

      // If request was successful
      this.data.visible = value;
      const activeSring = value ? 'activado' : 'desactivado';
      this.toastr.success(`Su anuncio ha sido correctamente ${activeSring}`, 'Actualización');
    } catch (error) {
      this.toastr.error('Hubo un error con la base de datos', 'Error');
    } finally {
      this.loading = false;
    }
  }

  onDeactivateAd(): Promise<void> {
    return this.setAdVisibleState(false);
  }

  async onActivateAd(event) {
    const plan = await this.stripe.user$.pipe(take(1)).toPromise();
    if (plan.status === 'ACTIVO') {
      return this.setAdVisibleState(true);
    }

    // Open dialog if user doesn't have registered a card
    this.loading = true;
    let cards = await this.stripe.getSources().pipe(first()).toPromise();
    this.loading = false;

    if (cards.length === 0) {
      const customer = await this.openNoCardPopUp(event);
      if (!customer) {
        return;
      }
      cards = customer.sources.data;
    }

    await this.openSubscribePopUp(cards);
  }

  private async openSubscribePopUp(cards: any[]): Promise<void> {
    const dialogRef = this.dialog.open(SubscribePopupComponent, {
      width: '400px',
      data: { cards }
    });

    const success = await dialogRef.afterClosed().toPromise();
    if (success) {
      this.toastr.success('Se ha actualizado su plan', 'Actualización');
    }
  }

  private async openNoCardPopUp(event): Promise<any> {
    const dialogRef = this.dialog.open(NoCardPopupComponent, {
      width: '400px',
      data: { }
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result === 'addCard') {
      try {
        const customer = await this.checkout(event);
        return customer;
      } catch (error) {
        // Something went wrong while adding card.
        return false;
      }
    }
    return false;
  }

  // Open the checkout handler
  private async checkout(event) {
    const user = await this.stripe.getUser();

    return new Promise((resolve, reject) => {
      this.handler = StripeCheckout.configure({
        key: environment.stripe.key,
        locale: 'es',
        currency: 'mxn',
        allowRememberMe: false,
        source: async (source) => {
          try {
            this.loading = true;
            const customer = await this.stripe.attachSource(source.id).toPromise();
            resolve(customer);
          } catch (error) {
            reject(error);
          } finally {
            this.loading = false;
          }
        }
      });

      this.handler.open({
        name: 'Registro de tarjeta',
        description: 'Ingrese los datos su tarjeta',
        email: user.email,
        panelLabel: 'Agregar Tarjeta'
      });
      event.preventDefault();
    });
  }

  // Close on navigate
  @HostListener('window:popstate')
  onPopState() {
    this.handler.close();
  }

}
