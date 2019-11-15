import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DirectorioI, ChartType } from '../../models/interfaces/general.interfaces';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  data: any;
  visitas: any;
  contactos: any;
  barScheme = {
    domain: ['#3a7458', '#28795c',  '#287478', '#284677', '#25416f', '#213f64', '#58205f', '#342163', '#002548']
  };
  mujeres_visitas: ChartType[];
  mujeres_contactos: ChartType[];
  hombres_visitas: ChartType[];
  hombres_contactos: ChartType[];

  constructor(
    // private storage: StorageService,
    private service: DatabaseService,
    private route: ActivatedRoute,
    private router: Router,
    ) {
      this.route.paramMap.subscribe(params => {
        console.log(params);
        if (params.has('id') && params.has('estado')) {
          const estado = params.get('estado');
          const id = params.get('id');
          console.log('data from dash', {estado, id});
          this.service.getDocumentData<DirectorioI>(`Directorio/Estados/${estado}/`, id).subscribe( (res) => {
            console.log('gettin data in detail', {res});
            this.data = res;
            this.visitas = (
              this.data.visitas_h_16_17 +
              this.data.visitas_h_18_24 +
              this.data.visitas_h_25_34 +
              this.data.visitas_h_35_44 +
              this.data.visitas_h_45_54 +
              this.data.visitas_h_55_mas +
              this.data.visitas_m_16_17 +
              this.data.visitas_m_18_24 +
              this.data.visitas_m_25_34 +
              this.data.visitas_m_35_44 +
              this.data.visitas_m_45_54 +
              this.data.visitas_m_55_mas
            );
            this.contactos = (
              this.data.contactos_h_16_17 +
              this.data.contactos_h_18_24 +
              this.data.contactos_h_25_34 +
              this.data.contactos_h_35_44 +
              this.data.contactos_h_45_54 +
              this.data.contactos_h_55_mas +
              this.data.contactos_m_16_17 +
              this.data.contactos_m_18_24 +
              this.data.contactos_m_25_34 +
              this.data.contactos_m_35_44 +
              this.data.contactos_m_45_54 +
              this.data.contactos_m_55_mas
            );
            this.hombres_visitas = [
              {
                name: '16-17',
                value: this.data.visitas_h_16_17,
              },
              {
                name: '18-24',
                value: this.data.visitas_h_18_24,
              },
              {
                name: '25-34',
                value: this.data.visitas_h_25_34,
              },
              {
                name: '35-44',
                value: this.data.visitas_h_35_44,
              },
              {
                name: '45-54',
                value: this.data.visitas_h_45_54,
              },
              {
                name: '55-mas',
                value: this.data.visitas_h_55_mas,
              },
            ];
            this.hombres_contactos = [
              {
                name: '16-17',
                value: this.data.contactos_h_16_17,
              },
              {
                name: '18-24',
                value: this.data.contactos_h_18_24,
              },
              {
                name: '25-34',
                value: this.data.contactos_h_25_34,
              },
              {
                name: '35-44',
                value: this.data.contactos_h_35_44,
              },
              {
                name: '45-54',
                value: this.data.contactos_h_45_54,
              },
              {
                name: '55-mas',
                value: this.data.contactos_h_55_mas,
              },
            ];
            this.mujeres_contactos = [
              {
                name: '16-17',
                value: this.data.contactos_m_16_17,
              },
              {
                name: '18-24',
                value: this.data.contactos_m_18_24,
              },
              {
                name: '25-34',
                value: this.data.contactos_m_25_34,
              },
              {
                name: '35-44',
                value: this.data.contactos_m_35_44,
              },
              {
                name: '45-54',
                value: this.data.contactos_m_45_54,
              },
              {
                name: '55-mas',
                value: this.data.contactos_m_55_mas,
              },
            ];
            this.mujeres_visitas = [
              {
                name: '16-17',
                value: this.data.visitas_m_16_17,
              },
              {
                name: '18-24',
                value: this.data.visitas_m_18_24,
              },
              {
                name: '25-34',
                value: this.data.visitas_m_25_34,
              },
              {
                name: '35-44',
                value: this.data.visitas_m_35_44,
              },
              {
                name: '45-54',
                value: this.data.visitas_m_45_54,
              },
              {
                name: '55-mas',
                value: this.data.visitas_m_55_mas,
              },
            ];
          });
        } else {
          this.router.navigate(['blog']);
        }
      });
  }

  ngOnInit() {

  }

}
