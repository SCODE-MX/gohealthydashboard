import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IUser } from '../models/interfaces/general.interfaces';
import { normalizeString } from '../models/functions/general.functions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<IUser | null>;
  estado: string;
  // tslint:disable-next-line:max-line-length
  constructor(private afAuth: AngularFireAuth, private  router: Router, private afDB: AngularFirestore) {
    this.user = this.initAuthState();
  }


  initAuthState(): Observable<IUser | null> {
     return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          console.log({user});
          return this.afDB.collection(`Propietarios/`, ref =>
          ref.where('correo', '==', user.email)).valueChanges();
          // .toPromise().then(res => console.log('respuesta del collection.where', {res})).catch(err => console.error(err));
          // return this.afDB.doc<IUser>(`Propietarios/Estados/${this.estado}/${user.providerId}`).valueChanges();
        } else {
          this.router.navigate(['login']);
          return of(null);
        }
      })
    );
  }

  // createUser(email: string, username: string, password: string): void {
  //   this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(res => {
  //     this.afDB.doc(`Usuarios/${res.user.uid}`).set({
  //       id: res.user.uid,
  //       email: res.user.email,
  //       username,
  //       rol: 'Admin'
  //     }).then( () => {
  //       this.router.navigate(['dashboard']);
  //       console.log('Inicio de sesión exitoso');
  //     }).catch(console.error);
  //     // console.log(res);
  //   }).catch(console.error);
  // }

  login(email: string, password: string, state?: string): Promise<firebase.auth.UserCredential> {
    // this.estado = normalizeString(state);
    // console.log('estado from authservice', this.estado);
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    this.router.navigate(['login']);
    return this.afAuth.auth.signOut();
  }

  resetPasswordInit(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  // updateUser(user: IUser, photo?: File[]) {
  //   // if (photo.length > 0) {
  //   //   return this.afDB.doc(`Usuarios/${user.id}`).update({
  //   //     username: user.username,
  //   //     descripcion: user.descripcion
  //   //    });
  //   // }
  //   return this.afDB.doc(`Propietarios/Estados/${this.estado}/${user.id}`).update({
  //    username: user.nombre,
  //   //  descripcion: user.descripcion
  //   });
  // }
}
