import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-modal-componenteskit',
  templateUrl: './modal-componenteskit.component.html',
  styleUrls: ['./modal-componenteskit.component.scss']
})
export class ModalComponenteskitComponent implements OnInit {

  FormularioData: FormGroup;
  dataform: any = '';
  dataSaldoCubrir: any = [];
  item_modal: any = [];
  item_inkit: any = [];
  item: any = [];
  userConn: any;

  displayedColumns = ['item', 'descripcion', 'medida', 'unidad', 'accion'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<ModalComponenteskitComponent>,
    @Inject(MAT_DIALOG_DATA) public dataItem: any, private api: ApiService,
    public _snackBar: MatSnackBar, public dialog: MatDialog, public log_module: LogService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.getAllinKit();
    this.getAllitem();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      codigo: [this.dataItem.dataItem.codigo, Validators.compose([Validators.required])],
      item: [this.dataform.item, Validators.compose([Validators.required])],
      cantidad: [this.dataform.cantidad],
      unidad: [this.dataItem.dataItem.unidad],
    });
  }

  submitData() {
    let ventana = "kitComponentes-create"
    let detalle = "kitComponentes-detalle";
    let tipo = "transaccion-kitComponentes-POST";

    let data = this.FormularioData.value;
    // console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /inventario/mant/inctrlstock  POST";
    return this.api.create("/inventario/mant/inkit/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.dataSaldoCubrir = datav;

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

  getAllitem() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/initem/catalogo/' + this.userConn)
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

  getAllinKit() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getById('/inventario/mant/inkit/initem_inkit/' + this.userConn + "/" + this.dataItem.dataItem.codigo)
      .subscribe({
        next: (datav) => {
          this.item_inkit = datav;
          // console.log(this.item_inkit);

          this.dataSource = new MatTableDataSource(this.item_inkit);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  eliminar(element): void {
    let ventana = "kitComponentes-delete"
    let detalle = "kitComponentes-detalle";
    let tipo = "transaccion-kitComponentes-DELETE";
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/mant/inkit/' + this.userConn + "/" + this.dataItem.dataItem.codigo + '/' + element.item)
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
