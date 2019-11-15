export interface IUser {
    categoria: string;
    correo: string;
    estado: string;
    createdOn?: string;
    id: string;
    nombre: string;
}
export interface DirectorioI {
    categoria: string;
    compartidos: number;
    contactado: number;
    correo: string;
    createdOn: Date;
    descripcion: string;
    direccion: string;
    estado: string;
    facebook: string;
    horario: string;
    latitud: number;
    likes: number;
    longitud: number;
    id?: string;
    nombre: string;
    telefono: string;
    sitio_web: string;
    referencias: string[];
    refFotos: string[];
    urlFotos: string[];
    visitas: number;
    visitas_h_16_17: number;
    visitas_h_18_24: number;
    visitas_h_25_34: number;
    visitas_h_35_44: number;
    visitas_h_45_54: number;
    visitas_h_55_mas: number;
    visitas_m_16_17: number;
    visitas_m_18_24: number;
    visitas_m_25_34: number;
    visitas_m_35_44: number;
    visitas_m_45_54: number;
    visitas_m_55_mas: number;
    contactos_h_16_17: number;
    contactos_h_18_24: number;
    contactos_h_25_34: number;
    contactos_h_35_44: number;
    contactos_h_45_54: number;
    contactos_h_55_mas: number;
    contactos_m_16_17: number;
    contactos_m_18_24: number;
    contactos_m_25_34: number;
    contactos_m_35_44: number;
    contactos_m_45_54: number;
    contactos_m_55_mas: number;
}
export interface ChartType {
    name: string;
    value: number;
}
