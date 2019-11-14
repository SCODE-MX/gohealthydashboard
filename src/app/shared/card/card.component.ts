import { Component, OnInit, Input } from '@angular/core';
import { DirectorioI } from '../../models/interfaces/general.interfaces';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  visitas: number;
  contactos: number;
  @Input() data: DirectorioI;
  @Input() option: boolean;
  constructor() {

  }

  ngOnInit() {
    if (this.data) {
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
    }
  }

}
