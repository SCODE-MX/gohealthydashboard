import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
// import { FormulariosI } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public isLoading = false; // Activate BarProgress
  /** Colecciones  */
  private collection: AngularFirestoreCollection;
  private collectionName: string;
  /** Documentos  */
  constructor(private afs: AngularFirestore,
              private fireStorage: AngularFireStorage) {}

  // Basic CRUD
  getData(reference: string): Observable<any> {
    const collection = this.getCollection(reference);
    return collection.valueChanges({ idField: 'id' });
  }
  getDocument<T>(reference: string, id: string): Observable<any> {
    const collection = this.getCollection(reference);
    return collection.doc<T>(id).get();
  }
  getPlaces(state: string, idPropietario: string): Observable<any> {
    console.log('data in getPlaces', {state, idPropietario});
    const places = this.afs.collection(`Directorio/Estados/${state}/`, ref =>
    ref.where('propietario', '==', idPropietario));
    return places.valueChanges();
  }

  getDocumentData<T>(reference: string, id: string) {
    return this.afs.collection(`${reference}`, ref =>
      ref.orderBy('createdOn', 'desc')
    ).doc<T>(id).get();
  }

  // async update<T>(reference: string, data: any, id: string, element: FormulariosI<any>): Promise<void> {
  //   const collection = this.getCollection(reference);
  //   if ( element.archivos ) {
  //     console.log('if element.archivos');
  //     const uploadData = await this.uploadfiles(reference, element.formulario.nombre, element.archivos);
  //     element.formulario.urlFotos = [...element.formulario.urlFotos, ...uploadData.url];
  //     element.formulario.refFotos = [...element.formulario.refFotos, ...uploadData.ref];
  //     console.log('despues de uploadfiles ->', element.formulario);
  //   }
  //   return collection.doc<T>(id).update(element.formulario);
  // }
  // async create<T>(reference: string, data: FormulariosI<any>, idFormed?: string ): Promise<void> {
  //   let id: string;
  //   if (idFormed) {
  //     id = `${idFormed}${this.afs.createId()}`;
  //   } else {
  //     id = this.afs.createId();
  //   }
  //   const timestamp = new Date();
  //   const collection = this.getCollection(reference);
  //   if ( data.archivos ) {
  //     const uploadData = await this.uploadfiles(reference, data.formulario.nombre, data.archivos);
  //     data.formulario['urlFotos'] = uploadData.url;
  //     data.formulario['refFotos'] = uploadData.ref;
  //   }
  //   // console.log({ id, ...data.formulario, createdOn: timestamp });
  //   return collection.doc(id).set({ id, ...data.formulario, createdOn: timestamp });
  // }
  delete(reference: string, id: string): Promise<void> {
    const collection = this.getCollection(reference);
    return collection.doc(id).delete();
  }

 async uploadfiles(reference: string, nombre: string, files: File[]): Promise<{url: string[], ref: string[]}> {
    let urlArr: Promise<string>[] = [];
    const refArr: string[] = [];
    urlArr = files.map(async (file: File, index) => {
      const filePath = `${reference}/${Date.now()}_${nombre}_${index}.png`;
      refArr.push(filePath);
      const fileRef = this.fireStorage.ref(filePath);
      let downloadURL: Observable<string>;
      const task = fileRef.put(file);
      await task.snapshotChanges().pipe(finalize(() => downloadURL = fileRef.getDownloadURL())).toPromise();
      // const resUrl = await downloadURL.toPromise();
      return downloadURL.toPromise();
      // return resUrl;
    });
    const urls =  await Promise.all(urlArr);
    return {url: urls, ref: refArr};
  }
  // Auxiliar collection methods
  private getCollection(reference: string): AngularFirestoreCollection<any> {
    return this.afs.collection(`${reference}`, ref =>
      ref.orderBy('createdOn', 'desc')
    );
  }
  deletePhoto(path: string) {
    return this.fireStorage.ref(path).delete().toPromise();
  }

}
