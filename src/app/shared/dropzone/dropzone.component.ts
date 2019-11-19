import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent implements OnInit {
  // ---------------------------
  // Inputs
  // ---------------------------
  @Input() urls: string[];
  @Input() refs: string[];
  // ---------------------------
  // Outputs
  // ---------------------------
  @Output() urlresult = new EventEmitter<string[]>();
  @Output() refresult = new EventEmitter<string[]>();
  @Output() added = new EventEmitter<File[]>();
  @Output() deleted = new EventEmitter<string[]>();
  @Output() isValid = new EventEmitter<boolean>();
  // ---------------------------
  // editable = false;
  contador: number;
  showDrop: boolean;
  files: File[] = [];
  deletedFotos: string[] = [];
  constructor() { }

  ngOnInit() {
    this.contador = this.urls.length;
  }

  onSelect(event: any) {
    if (event.addedFiles) {
      let aux: File[] = event.addedFiles;
      if ( aux.length > 5 || this.contador > 1) {
          aux = aux.slice(0, 5 - this.contador);
          if (this.contador + aux.length >= 5) {
            this.showDrop = true;
          }
        } else {
          this.showDrop = false;
        }
      this.files.push(...aux);
      this.added.emit(this.files); // Emiting files to upload
      if (this.refs) {
        this.contador = this.refs.length + this.files.length;
      } else {
        console.log('onSelect', this.refs);
        this.contador = this.files.length;
      }
    }
    if (this.contador > 0) {
      this.isValid.emit(true);
    } else {
      this.isValid.emit(false);
    }
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.added.emit(this.files);
    if (this.refs) {
      this.contador = this.refs.length + this.files.length;
    } else {
      this.contador = this.files.length;
    }
    if (this.contador > 0) {
      this.isValid.emit(true);
    } else {
      this.isValid.emit(false);
    }
  }
  resetDropzone() {
    this.files = [];
    this.added.emit(this.files);
    if (this.refs) {
      this.contador = this.refs.length + this.files.length;
    } else {
      this.contador = this.files.length;
    }
    if (this.contador < 5) {
      this.showDrop = false;
    }
    if (this.contador > 0) {
      this.isValid.emit(true);
    } else {
      this.isValid.emit(false);
    }
  }
  onDelete(index: number) {
    // console.log('onDelete before', {refs: this.refs, urls: this.urls});
    this.urls.splice(index, 1);
    this.urlresult.emit(this.urls);
    // this.refs.splice(index, 1);
    const fotoDelete =  this.refs.splice(index, 1);
    this.refresult.emit(this.refs);
    this.deletedFotos = [...this.deletedFotos, ...fotoDelete];
    this.deleted.emit(this.deletedFotos);
    // if (this.urlFotos) {
      //   this.data.formulario.urlFotos = [...this.urlFotos];
      // }
      // if (this.refs) {
        //   this.data.formulario.refs = [...this.refs];
        // }
    // console.log('onDelete after', {refs: this.refs, urls: this.urls});
    if (this.files) {
      this.contador = this.refs.length + this.files.length;
    } else {
      this.contador = this.refs.length;
    }
    if (this.contador < 5) {
      this.showDrop = false;
    }
    if (this.contador > 0) {
      this.isValid.emit(true);
    } else {
      this.isValid.emit(false);
    }
    // console.log('onDelete ->', {refs: this.refs}, {fotoDel: fotoDelete}, {deletedFoto: this.deletedFotos});
    // this.deletedFotos = [...this.deletedFotos, ...fotoDelete];
    // this.dataForm.urlFotos = [...this.urlFotos];
    // this.dataForm.refFotos = [...this.refFotos];
    // this.itemsDrop = this.itemsDrop - 1;
  }
}
