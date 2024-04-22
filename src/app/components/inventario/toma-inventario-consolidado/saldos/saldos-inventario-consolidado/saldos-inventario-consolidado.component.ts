import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TomaInventarioConsolidadoComponent } from '../../toma-inventario-consolidado.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { ServiceRefreshItemsService } from '../../services-refresh-item/service-refresh-items.service';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
@Component({
  selector: 'app-saldos-inventario-consolidado',
  templateUrl: './saldos-inventario-consolidado.component.html',
  styleUrls: ['./saldos-inventario-consolidado.component.scss']
})
export class SaldosInventarioConsolidadoComponent implements OnInit {

  FormularioDataEdit:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any;
  
  primera_ventana = true;
  segunda_ventana = false;
  cod_almacen_cliente: any = [];
  saldo_inventario: any = [];
  items: any = [];
  errorMessage: string;
  userConn: any;

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  
  public ventana="saldo-inventa-update"
  public detalle="saldo-inventa-update";
  public tipo = "saldo-inventa-PUT";
  
  constructor(public dialogRef: MatDialogRef<SaldosInventarioConsolidadoComponent>, public almacenservice: ServicioalmacenService,
    public dialog: MatDialog, private _formBuilder: FormBuilder, public log_module: LogService, private api: ApiService,
    private toastr: ToastrService, private datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public dataCabecera: any,
    private spinner: NgxSpinnerService,public tomaInventario:TomaInventarioConsolidadoComponent, private refreshItemSer: ServiceRefreshItemsService){    

    console.log(dataCabecera);
    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit() {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
       
    this.almacenservice.disparadorDeAlmacenes.subscribe(data =>{
      console.log("Recibiendo Almacen: ", data);
      this.cod_almacen_cliente = data.almacen;
    });
  }

  createForm(): FormGroup {
    const usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: [this.dataCabecera.dataCabecera.codigo],
      id: [this.dataCabecera.dataCabecera.id],
      numeroid: [this.dataCabecera.dataCabecera.numeroid],
      fechainicio: [this.dataCabecera.dataCabecera.fechainicio],
      fechafin: [this.dataCabecera.dataCabecera.fechafin],
      obs: [this.dataCabecera.dataCabecera.obs],
      codpersona: [this.dataCabecera.dataCabecera.codpersona],
      codalmacen: [this.dataCabecera.dataCabecera.codalmacen],
      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
      abierto:true,
    });
  } 
  
  generarSaldoFisico(){
    let data = this.FormularioDataEdit.value;
 
    console.log(data);
 
    this.errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:- /inventario/oper/prgsaldoinv Update";
    return this.api.update('/inventario/oper/prgsaldoinv/'+this.userConn+"/"+this.dataCabecera.dataCabecera.codigo+"/"+this.cod_almacen_cliente.codigo, data)
      .subscribe({
        next: (datav) => {
          this.saldo_inventario = datav;

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          this.toastr.success('! SALDO EXITOSO !');
          
          this.close();
        },
    
        error: (err: any) => { 
          this.toastr.error('! NO SE SACO LOS SALDOS !');
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data:{almacen:"almacen"}
    });
  }

  confirmacion(){ 
    this.segunda_ventana = true

    this.primera_ventana = false;
  }

  close() {
    this.dialogRef.close();
    this.refreshItemSer.callItemFunction();
  }

}
