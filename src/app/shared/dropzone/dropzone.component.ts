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
  @Input() maxItems = 1;
  @Input() multiple = false;
  @Input() urls: string[];
  @Input() refs: string[];
  @Input() module: string;
  @Input() name: string;
  @Input() action: string;
  // ---------------------------
  // Outputs
  // ---------------------------
  @Output() urlresult = new EventEmitter<string>();
  @Output() added = new EventEmitter<string>();
  @Output() deleted = new EventEmitter<string>();
  @Output() done = new EventEmitter<boolean>();
  // ---------------------------
  constructor() { }

  ngOnInit() {
  }

}
