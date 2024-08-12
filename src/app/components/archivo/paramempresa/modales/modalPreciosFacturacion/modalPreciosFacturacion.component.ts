import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modalPreciosFacturacion',
  templateUrl: './modalPreciosFacturacion.component.html',
  styleUrls: ['./modalPreciosFacturacion.component.scss']
})
export class ModalPreciosFacturacionComponent implements OnInit {

  FormularioData: FormGroup;
  public dataform: any = [];
  public tarifasfact = [];
  public params_tarifas = [];
  public intarifa: any = [];
  public dataEmpresa = [];
  empresa = "PE";
  userConn: any;
  BD_storage: any;

  displayedColumns = ['codtarifa', 'descripcion', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  public ventana = "prec-fac-create"
  public detalle = "prec-fac-detalle";
  public tipo = "prec-fac-POST";

  constructor(public dialogRef: MatDialogRef<ModalPreciosFacturacionComponent>, private api: ApiService, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public dataEmpresaParametros: any, public _snackBar: MatSnackBar, public dialog: MatDialog,
    private _formBuilder: FormBuilder, public log_module: LogService, private toastr: ToastrService,) {

    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.FormularioData = this.createForm();
    this.getAllinTarifaSelect(this.userConn);
  }

  ngOnInit() {
    this.dataEmpresa = this.dataEmpresaParametros.dataEmpresaParametros;
    this.getbyIdparametrosTarifas();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      codempresa: [this.empresa],
      codtarifa: [this.dataform.codigo_intarifa, Validators.compose([Validators.required])],
    });
  }

  getAllinTarifaSelect(useConn) {
    //select
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/adparametrosDiasextranc";
    return this.api.getAll('/inventario/mant/intarifa/' + useConn)
      .subscribe({
        next: (datav) => {
          this.intarifa = datav;
          // console.log('data', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getbyIdparametrosTarifas() {
    //tabla
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/adparametrosDiasextranc";
    return this.api.getById('/seg_adm/mant/adparametros_tarifasfact/' + this.userConn + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          this.params_tarifas = datav;
          // console.log('data', datav);
          this.dataSource = new MatTableDataSource(this.params_tarifas);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adparametros_tarifasfact";

    return this.api.create("/seg_adm/mant/adparametros_tarifasfact/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.tarifasfact = datav;
          this.toastr.success('! SE GUARDO EXITOSAMENTE !');
          this.getbyIdparametrosTarifas();

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- seg_adm/mant/adparametrosTarifasfact Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      // console.log(result);
      if (result) {
        return this.api.delete('/seg_adm/mant/adparametros_tarifasfact/' + this.userConn + "/" + element.codtarifa + '/' + this.BD_storage)
          .subscribe({
            next: () => {
              this.spinner.show();
              setTimeout(() => {
                this.spinner.hide();
              }, 1000);
              this.getbyIdparametrosTarifas();
            },
            error: (err: any) => {
              console.log(errorMessage);
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! NO SE ELIMINO !');
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
