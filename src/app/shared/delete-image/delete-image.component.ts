import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-image',
  templateUrl: './delete-image.component.html',
  styleUrls: ['./delete-image.component.scss']
})
export class DeleteImageComponent implements OnInit {
  @Input() url: string;
  @Input() disabled = false;
  @Output() deleted = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {

  }

  eliminar() {
    this.deleted.emit(true);
  }
}
