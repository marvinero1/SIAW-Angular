import { DatePipe } from '@angular/common';
import { Component, Inject ,OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-validar-precio-item',
  templateUrl: './validar-precio-item.component.html',
  styleUrls: ['./validar-precio-item.component.scss']
})
export class ValidarPrecioItemComponent implements OnInit {

  get_item: any = [];
  

  constructor(private _formBuilder: FormBuilder, public log_module:LogService, public dialogRef: MatDialogRef<ValidarPrecioItemComponent>, 
    @Inject(MAT_DIALOG_DATA) public dataItem: any, private api:ApiService, private datePipe: DatePipe,private toastr: ToastrService,
    public _snackBar: MatSnackBar){
    // this.FormularioDataEdit = this.createForm();
  }

  ngOnInit(){
    this.get_item = this.dataItem.dataItem;
    
    console.log(this.get_item);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  } 

  confirmado(): void {
    this.dialogRef.close(true);
  }

}
