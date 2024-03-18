import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TipocambiovalidacionCreateComponent } from '@components/seguridad/tipocambiovalidacion/tipocambiovalidacion-create/tipocambiovalidacion-create.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-tipocambio-create',
  templateUrl: './tipocambio-create.component.html',
  styleUrls: ['./tipocambio-create.component.scss']
})
export class TipocambioCreateComponent implements OnInit {

  public fecha_actual = new Date();
  displayedColumns = ['codigo','accion'];
  dataSource = new MatTableDataSource();
  userConn:any;

	public ventana="tipocambio-create"
	public detalle="tipocambio-detalle";
	public tipo="tipocambio-area-POST";

  moneda=[];
  data="";

  constructor(private api:ApiService, public dialog: MatDialog, private _formBuilder: FormBuilder, 
    public dialogRef: MatDialogRef<TipocambiovalidacionCreateComponent>,public log_module:LogService){
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  }

  ngOnInit(){
    this.getAllmoneda();
  }

  getAllmoneda(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
          // console.log(this.moneda);
          this.dataSource = new MatTableDataSource(this.moneda);
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  agregarTipoCambio(dataMoneda){
    this.data = dataMoneda;
    const dialogRef = this.dialog.open(TipocambiovalidacionCreateComponent, {
        data: {dataMoneda:dataMoneda},
        width: '350px',
        height:'auto',
    });
  }

  close(){
    this.dialogRef.close();
  }
}
