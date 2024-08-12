import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';

@Component({
  selector: 'app-talonario-recibos-create',
  templateUrl: './talonario-recibos-create.component.html',
  styleUrls: ['./talonario-recibos-create.component.scss']
})
export class TalonarioRecibosCreateComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  talon: any = [];
  userConn: any;
  userLogueado: any = [];

  inputValue: number | null = null;
  inputValue1: number | null = null;
  inputValue2: number | null = null;


  vendedor_get: any = [];
  cod_vendedor: any;

  public ventana = "talonario-create"
  public detalle = "talonario-detalle";
  public tipo = "transaccion-talonario-POST";

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<TalonarioRecibosCreateComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService, public serviciovendedor: VendedorService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }


  createForm(): FormGroup {
    let usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;


    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
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

  ngOnInit() {
    this.serviciovendedor.disparadorDeVendedores.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.cod_vendedor = data.vendedor;
    });
  }
  ngAfterViewInit() {
    this.getVendedorCatalogo();
  }


  getVendedorCatalogo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
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



  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /ctsxcob/mant/cotalonario/";

    return this.api.create("/ctsxcob/mant/cotalonario/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.talon = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.onNoClick();
          this.spinner.show();
          this.toastr.success('Guardado con Exito! 🎉');

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
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
      this.inputValue = null;
    }
  }
  onInputChange1(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue1 = parsedValue;
    } else {
      this.inputValue1 = null;
    }
  }
  onInputChange2(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue2 = parsedValue;
    } else {
      this.inputValue2 = null;
    }
  }

}
