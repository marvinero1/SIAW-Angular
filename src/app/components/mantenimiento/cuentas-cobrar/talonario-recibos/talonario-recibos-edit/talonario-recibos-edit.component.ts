import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-talonario-recibos-edit',
  templateUrl: './talonario-recibos-edit.component.html',
  styleUrls: ['./talonario-recibos-edit.component.scss']
})
export class TalonarioRecibosEditComponent implements OnInit, AfterViewInit {

  FormularioDataEdit: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  talon_edit: any = [];
  dataform: any = '';
  talon: any = [];
  usuario_logueado: any;
  user_conn: any;
  errorMessage;

  inputValue: number | null = null;
  inputValue1: number | null = null;
  inputValue2: number | null = null;

  vendedor_get: any = [];
  cod_vendedor: any;

  public ventana = "talonario"
  public detalle = "talonario-edit";
  public tipo = "talonario-edit-PUT";

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, public log_module: LogService, public dialogRef: MatDialogRef<TalonarioRecibosEditComponent>,
    @Inject(MAT_DIALOG_DATA) public datatalonEdit: any, private api: ApiService, private datePipe: DatePipe, private toastr: ToastrService,
    public _snackBar: MatSnackBar, public serviciovendedor: VendedorService) {
    
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.talon_edit = this.datatalonEdit.datatalonEdit;

    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit() {
    this.serviciovendedor.disparadorDeVendedores.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.talon_edit.codvendedor = data.vendedor;
    });
  }

  ngAfterViewInit() {
    this.getVendedorCatalogo();
  }

  getVendedorCatalogo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.user_conn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  modalVendedor(): void {
    this.dialog.open(ModalVendedorComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        ventana: "ventana"
      }
    });
  }

  onLeaveVendedor(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.vendedor_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  createForm(): FormGroup {
    const usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.datatalonEdit.datatalonEdit?.codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],

      TalDel: [this.dataform.TalDel, Validators.pattern(/^-?\d+$/)],
      TalAl: [this.dataform.TalAl, Validators.pattern(/^-?\d+$/)],
      nroactual: [this.dataform.nroactual, Validators.pattern(/^-?\d+$/)],
      Fecha: [this.dataform.Fecha, Validators.compose([Validators.required])],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      Usuarioreg: [usuario_logueado],

      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
    });
  }

  submitData() {
    let data = this.FormularioDataEdit.value;

    this.errorMessage = "La Ruta presenta fallos al hacer la creacion Ruta:-/ctsxcob/mant/cotalonario/ Update";
    return this.api.update('/ctsxcob/mant/cotalonario/' + this.user_conn + "/" + this.talon_edit?.codigo, data)
      .subscribe({
        next: (datav) => {
          this.talon = datav;
          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          location.reload();
        },

        error: (err: any) => {
          this.toastr.error('! NO SE EDITO !');
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onInputChange(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue = parsedValue;
    } else {
      this.talon_edit.nroactual = null;
    }
  }

  onInputChange1(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue1 = parsedValue;
    } else {
      this.talon_edit.talDel = null;
    }
  }

  onInputChange2(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue2 = parsedValue;
    } else {
      this.talon_edit.talAl = null;
    }
  }
}
