import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-modal-precioControl',
  templateUrl: './modal-precioControl.component.html',
  styleUrls: ['./modal-precioControl.component.scss']
})
export class ModalPrecioControlComponent implements OnInit {

  almacen: any = [];
  precio_lista: any = [];
  control_tarifa: any = [];
  max_venta_item: any = [];
  dataMaximoVentas: any = [];
  dataform: any = '';
  userConn: any;

  displayedColumns = ['codtarifa_a', 'codtarifa_b', 'accion'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;


  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();
  FormularioData: any;

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<ModalPrecioControlComponent>,
    @Inject(MAT_DIALOG_DATA) public dataItem: any, private api: ApiService,
    public _snackBar: MatSnackBar, public dialog: MatDialog, public log_module: LogService) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.getAllControlTarifa();
    this.getAllListaPrecio();

  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      coditem: [this.dataItem.dataItem.codigo, Validators.compose([Validators.required])],
      codtarifa_a: [this.dataform.codtarifa_a, Validators.compose([Validators.required])],
      codtarifa_b: [this.dataform.codtarifa_b, Validators.compose([Validators.required])],
    });
  }

  submitData() {
    let ventana = "PrecioControl-create"
    let detalle = "PrecioControl-detalle";
    let tipo = "transaccion-PrecioControl-POST";
    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /inventario/mant/inctrlstock  POST";
    return this.api.create("/inventario/mant/initem_controltarifa/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.dataMaximoVentas = datav;

          this.onNoClick();
          this.log_module.guardarLog(ventana, detalle, tipo, "", "");
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
          });

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllControlTarifa() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --inventario/mant/initem_controltarifa";
    return this.api.getAll('/inventario/mant/initem_controltarifa/' + this.userConn + "/" + this.dataItem.dataItem.codigo)
      .subscribe({
        next: (datav) => {
          this.control_tarifa = datav;
          console.log(this.control_tarifa);

          this.dataSource = new MatTableDataSource(this.control_tarifa);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllListaPrecio() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --inventario/mant/intarifa";
    return this.api.getAll('/inventario/mant/intarifa/' + this.userConn)
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

  eliminar(element): void {
    let ventana = "PrecioControl-delete"
    let detalle = "PrecioControl-detalle";
    let tipo = "transaccion-PrecioControl-DELETE";
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/mant/initem_controltarifa/' + this.userConn + "/" + element.id)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(ventana, detalle, tipo, "", "");
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
      } else {
        alert("¡No se elimino!");
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
