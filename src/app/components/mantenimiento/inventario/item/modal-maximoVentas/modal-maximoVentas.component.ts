import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-maximoVentas',
  templateUrl: './modal-maximoVentas.component.html',
  styleUrls: ['./modal-maximoVentas.component.scss']
})
export class ModalMaximoVentasComponent implements OnInit {

  almacen:any=[];
  precio_lista:any=[];
  max_venta_item:any=[];
  dataMaximoVentas:any=[];
  dataform:any='';
  userConn:any;

  displayedColumns = ['codalmacen','codtarifa','maximo','dias','accion'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();
  FormularioData: any;

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<ModalMaximoVentasComponent>, 
    @Inject(MAT_DIALOG_DATA) public dataItem: any, private api:ApiService, private toastr: ToastrService,
    public _snackBar: MatSnackBar,public dialog: MatDialog, public log_module:LogService){
      this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

      this.FormularioData = this.createForm();
  }

  ngOnInit(){
    this.getAllAlmacen();
    this.getAllListaPrecio();

    this.getAllMaximoVentasItem()
  }

  createForm(): FormGroup{ 
    return this._formBuilder.group({
      coditem: [this.dataItem.dataItem.codigo, Validators.compose([Validators.required])],
      codtarifa: [this.dataform.codtarifa, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      dias: [this.dataform.dias, Validators.compose([Validators.required])],
      maximo: [this.dataform.maximo, Validators.compose([Validators.required])],
    });
  }

  submitData(){
    let ventana="MaximoVentas-create"
    let detalle="MaximoVentas-detalle";
    let tipo="transaccion-MaximoVentas-POST";

    let data = this.FormularioData.value;
    console.log(data);
    
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:- /inventario/mant/initem_max";
    return this.api.create("/inventario/mant/initem_max/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.dataMaximoVentas = datav;
          this.log_module.guardarLog(ventana,detalle, tipo);

          this.toastr.success('! SE GUARDO EXITOSAMENTE !');

          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
          });
          location.reload();
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  getAllMaximoVentasItem(){
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/initem_max/initem_initemMax/";
    return this.api.getAll('/inventario/mant/initem_max/initem_initemMax/'+this.userConn+"/"+this.dataItem.dataItem.codigo )
      .subscribe({
        next: (datav) => {
          this.max_venta_item = datav;
          console.log(this.max_venta_item);

          this.dataSource = new MatTableDataSource(this.max_venta_item);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllAlmacen(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/inalmacen";
    return this.api.getAll('/inventario/mant/inalmacen/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.almacen = datav;
          // console.log(this.almacen);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllListaPrecio(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --inventario/mant/intarifa";
    return this.api.getAll('/inventario/mant/intarifa/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.precio_lista = datav;
          // console.log(this.precio_lista);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  eliminar(element): void{
    let ventana="MaximoVentas-delete"
    let detalle="MaximoVentas-detalle";
    let tipo="transaccion-MaximoVentas-DELETE";
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/inventario/mant/initem_max/'+this.userConn+"/"+element.id)
        .subscribe({
          next: ()=>{
            this.log_module.guardarLog(ventana,detalle, tipo);
            this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
              duration: 3000,
            });
            location.reload();
          },
          error: (err: any) => { 
            console.log(errorMessage);
          },
          complete: () => { }
        })
      }else{
        alert("¡No se elimino!");
      }
    });
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
