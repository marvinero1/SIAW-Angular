import { Component, Inject ,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-validar-permiso-item',
  templateUrl: './validar-permiso-item.component.html',
  styleUrls: ['./validar-permiso-item.component.scss']
})
  
export class ValidarPermisoItemComponent implements OnInit {

  get_item: any = [];

  constructor(public log_module:LogService, public dialogRef: MatDialogRef<ValidarPermisoItemComponent>, 
    private api: ApiService, public _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public dataItem: any){

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
