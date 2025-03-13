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
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-modal-saldoCubrir',
  templateUrl: './modal-saldoCubrir.component.html',
  styleUrls: ['./modal-saldoCubrir.component.scss']
})
export class ModalSaldoCubrirComponent implements OnInit {

  FormularioData: FormGroup;
  dataform: any = '';
  dataSaldoCubrir: any = [];
  item_modal: any = [];
  item_contro_tarifa: any = [];
  item: any = [];
  userConn: any;

  displayedColumns = ['item', 'descripcion', 'medida', 'porcentaje', 'accion'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<ModalSaldoCubrirComponent>,
    @Inject(MAT_DIALOG_DATA) public dataItem: any, private api: ApiService,
    public _snackBar: MatSnackBar, public dialog: MatDialog, public log_module: LogService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.item_modal = this.dataItem;
    this.getAllItemControlTarifa();
    this.getAllitem();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      coditem: [this.dataItem.dataItem?.codigo, Validators.compose([Validators.required])],
      porcentaje: [this.dataform.porcentaje, Validators.compose([Validators.required])],
      coditemcontrol: [this.dataform.coditemcontrol]
    });
  }

  submitData() {
    let ventana = "SaldoCubrirItem-create"
    let detalle = "SaldoCubrirItem-detalle";
    let tipo = "transaccion-SaldoCubrirItem-POST";
    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /inventario/mant/inctrlstock  POST";
    return this.api.create("/inventario/mant/inctrlstock", data)
      .subscribe({
        next: (datav) => {
          this.dataSaldoCubrir = datav;

          console.log('data', datav);
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

  getAllItemControlTarifa() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getById('/inventario/mant/inctrlstock/initem_inctrlstock/' + this.userConn + "/" + this.dataItem.dataItem?.codigo)
      .subscribe({
        next: (datav) => {
          this.item_contro_tarifa = datav;
          console.log(this.item_contro_tarifa);

          this.dataSource = new MatTableDataSource(this.item_contro_tarifa);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllitem() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/initem/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.item = datav;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  eliminar(element): void {
    let ventana = "SaldoCubrirItem-delete"
    let detalle = "SaldoCubrirItem-detalle";
    let tipo = "transaccion-SaldoCubrirItem-DELETE";
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/mant/inctrlstock/' + this.userConn + "/" + element.id)
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
