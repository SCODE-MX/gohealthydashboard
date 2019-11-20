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
    horarios: string;
    latitud: number;
    likes: number;
    longitud: number;
    id?: string;
    nombre: string;
    telefono: string;
    sitioWeb: string;
    referencias: string[];
    refFotos: string[];
    urlFotos: string[];
    visitas: number;
}
