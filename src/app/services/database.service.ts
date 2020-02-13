import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { normalizeString } from '../models/functions/general.functions';
import { DirectorioI } from '../models/interfaces/general.interfaces';

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
    ).doc<T>(id).snapshotChanges().pipe(
      map(snapshot => ({ id: snapshot.payload.id, ...snapshot.payload.data() }))
      );
  }

  async update<T>(reference: string, data: any, id: string, archivos?: File[]): Promise<void> {
    const collection = this.getCollection(reference);
    if ( archivos ) {
      console.log('if archivos');
      const uploadData = await this.uploadfiles(reference, data.nombre, archivos);
      data.urlFotos = [...data.urlFotos, ...uploadData.url];
      data.refFotos = [...data.refFotos, ...uploadData.ref];
      console.log('despues de uploadfiles ->', data);
    }
    return collection.doc<T>(id).update(data);
  }

  delete(reference: string, id: string): Promise<void> {
    const collection = this.getCollection(reference);
    return collection.doc(id).delete();
  }

  setAdVisibleState(visible: boolean, userId: string, {estado, id}: DirectorioI): Promise<void> {
    const stateRef = this.afs.firestore.doc(`Directorio/Estados/${normalizeString(estado)}/${id}`);
    const userRef = this.afs.firestore.doc(`users/${userId}/`);
    const increment =  firestore.FieldValue.increment(visible ? 1 : -1);

    const batch = this.afs.firestore.batch();
    batch.update(stateRef, {visible});
    batch.update(userRef, {slots: increment});

    return batch.commit();
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
