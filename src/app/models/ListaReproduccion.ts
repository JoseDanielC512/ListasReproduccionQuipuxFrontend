import { Cancion } from './Cancion';

export interface ListaReproduccion {
    id?: number;
    nombre: string;
    descripcion?: string;
    canciones: Cancion[];
}
