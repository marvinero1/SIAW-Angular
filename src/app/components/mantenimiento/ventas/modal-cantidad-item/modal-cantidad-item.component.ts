import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-modal-cantidad-item',
  templateUrl: './modal-cantidad-item.component.html',
  styleUrls: ['./modal-cantidad-item.component.scss']
})
export class ModalCantidadItemComponent implements OnInit {

  item:any=[];

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<ModalCantidadItemComponent>, 
    @Inject(MAT_DIALOG_DATA) public itemModal: any, private api:ApiService, private datePipe: DatePipe, 
    public _snackBar: MatSnackBar){
    // this.FormularioDataEdit = this.createForm();
  }

  ngOnInit() {
    this.item = this.itemModal.itemModal;
    console.log(this.item);
    
  }

}
