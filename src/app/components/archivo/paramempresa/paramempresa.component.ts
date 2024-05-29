import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ModalMinimoComplementariasComponent } from './modales/modalMinimoComplementarias/modalMinimoComplementarias.component';
import { ModalCreditoAutorizacionComponent } from './modales/modalCreditoAutorizacion/modalCreditoAutorizacion.component';
import { ModalPreciosFacturacionComponent } from './modales/modalPreciosFacturacion/modalPreciosFacturacion.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-paramempresa',
  templateUrl: './paramempresa.component.html',
  styleUrls: ['./paramempresa.component.scss']
})
export class ParamempresaComponent implements OnInit {

  FormularioDataParamEmpresa: FormGroup;

  public parametros: any = [];
  public moneda: any = [];
  public dataform: any = [];
  public intarifa: any = [];
  public cncuenta: any = [];
  public planpago: any = [];
  public empresa: any;
  private errorMessage;
  public dataformupdate = [];
  userConn: any;
  BD_storage: any;

  @ViewChild('UploadFileInput') uploadFileInput: ElementRef;
  myfilename = 'Seleccionar Archivo';

  nombre_ventana: string = "prgadparametros.vb";
  public ventana = "Parametros de la Empresa"
  public detalle = "paramempresa-edit";
  public tipo = "transaccion-paramempresa-PUT";

  constructor(private api: ApiService, private spinner: NgxSpinnerService, public dialog: MatDialog, public log_module: LogService,
    public _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private toastr: ToastrService,
    public nombre_ventana_service: NombreVentanaService) {
    this.mandarNombre();
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }

  ngOnInit() {
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.getParametroSegunCodigoAdEmpresa(this.userConn, this.BD_storage);
    this.getEmpresa(this.userConn);
    this.getinTarifa(this.userConn);
    this.getAllmoneda(this.userConn);
    this.getcnCuenta(this.userConn);
    this.getveplanPago(this.userConn);

    this.FormularioDataParamEmpresa = this.createForm();
  }

  getEmpresa(userConn) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET en la ruta --parametros /seg_adm/mant/adempresa/";
    return this.api.getAll('/seg_adm/mant/adempresa/' + userConn)
      .subscribe({
        next: (datav) => {
          this.empresa = datav;
          // console.log('adempresa', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getinTarifa(userConn) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET en la ruta --parametros /inventario/mant/intarifa/";
    return this.api.getAll('/inventario/mant/intarifa/' + userConn)
      .subscribe({
        next: (datav) => {
          this.intarifa = datav;
          // console.log('adempresa', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getveplanPago(userConn) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET en la ruta --parametros /venta/mant/veplanpago/";
    return this.api.getAll('/venta/mant/veplanpago/' + userConn)
      .subscribe({
        next: (datav) => {
          this.planpago = datav;
          // console.log('adempresa', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getcnCuenta(userConn) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET en la ruta --parametros '/contab/mant/cncuenta/";
    return this.api.getAll('/contab/mant/cncuenta/' + userConn)
      .subscribe({
        next: (datav) => {
          this.cncuenta = datav;
          // console.log('adempresa', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getParametroSegunCodigoAdEmpresa(userConn, codigo: string) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET en la ruta --parametros /seg_adm/mant/adparametros/";
    return this.api.getAll('/seg_adm/mant/adparametros/' + userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.parametros = datav;
          console.log('parametrosEmpresa: ', datav);
          // this.spinner.show();
          // setTimeout(() => {
          //   this.spinner.hide();
          // }, 1500);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllmoneda(userConn) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/admoneda";
    return this.api.getAll('/seg_adm/mant/admoneda/' + userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.myfilename = '';
      Array.from(fileInput.target.files).forEach((file: File) => {
        console.log(file);
        this.myfilename += file.name + ',';
      });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {

          // Return Base64 Data URL
          const imgBase64Path = e.target.result;
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);

      // Reset File Input to Selct Same file again
      this.uploadFileInput.nativeElement.value = "";
    } else {
      this.myfilename = 'Select File';
    }
  }

  detectFiles(event) {
    console.log(event.currentTarget.files[0].webkitRelativePath);
  }

  openDialogMinimoComplementarias(dataEmpresaParametros) {
    const dialogRef = this.dialog.open(ModalMinimoComplementariasComponent, {
      width: '1120px',
      height: 'auto',
      data: { dataEmpresaParametros: dataEmpresaParametros },
    });
  }

  openDialogCreditoConAutorizacion(dataEmpresaParametros) {
    const dialogRef = this.dialog.open(ModalCreditoAutorizacionComponent, {
      width: '850px',
      height: 'auto',
      data: { dataEmpresaParametros: dataEmpresaParametros },
    });
  }

  openDialogPreciosFacturacion(dataEmpresaParametros) {
    const dialogRef = this.dialog.open(ModalPreciosFacturacionComponent, {
      width: '750px',
      height: 'auto',
      data: { dataEmpresaParametros: dataEmpresaParametros },
    });
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      codempresa: [this.dataform.codempresa, Validators.compose([Validators.required])],
      diascomplementarias: [this.dataform.diascomplementarias, Validators.compose([Validators.required])],
      maxcomplementarias: [this.dataform.maxcomplementarias, Validators.compose([Validators.required])],

      iva: [this.dataform.iva],
      rciva: [this.dataform.rciva],
      it: [this.dataform.it],
      frase: [this.dataform.frase],
      diasproceso: [this.dataform.diasproceso],
      cierres_diarios: [this.dataform.cierres_diarios == null ? false : true],
      fact_lineas_arriba: [this.dataform.fact_lineas_arriba],
      fecha_inicio_rutas: [this.dataform.fecha_inicio_rutas],
      bd_opcional: [this.dataform.bd_opcional],
      obliga_remito: [this.dataform.obliga_remito == null ? true : false],
      servidor_opcional: [this.dataform.servidor_opcional],
      acmonedaajuste: [this.dataform.acmonedaajuste == null ? false : true],

      dias_cierre_01: [this.dataform.dias_cierre_01],
      dias_cierre_02: [this.dataform.dias_cierre_02],
      dias_cierre_03: [this.dataform.dias_cierre_03],
      dias_cierre_04: [this.dataform.dias_cierre_04],
      dias_cierre_05: [this.dataform.dias_cierre_05],
      dias_cierre_06: [this.dataform.dias_cierre_06],
      dias_cierre_07: [this.dataform.dias_cierre_07],
      dias_cierre_08: [this.dataform.dias_cierre_08],
      dias_cierre_09: [this.dataform.dias_cierre_09],
      dias_cierre_10: [this.dataform.dias_cierre_10],
      dias_cierre_11: [this.dataform.dias_cierre_11],
      dias_cierre_12: [this.dataform.dias_cierre_12],

      minnacional: [this.dataform.minnacional],
      monminnal: [this.dataform.monminnal],
      minnoimponible: [this.dataform.minnoimponible],
      monminnoimpo: [this.dataform.monminnoimpo],
      regcomple: [this.dataform.regcomple],
      monregcomple: [this.dataform.monregcomple],
      afp: [this.dataform.afp],
      riesgocomun: [this.dataform.riesgocomun],
      aportevoluntario: [this.dataform.aportevoluntario],
      comisionafp: [this.dataform.comisionafp],
      riesgoprof: [this.dataform.riesgoprof],
      pnsv: [this.dataform.pnsv],
      cuatrosabados: [this.dataform.cuatrosabados],
      cincosabados: [this.dataform.cincosabados],
      prommesessueldo: [this.dataform.prommesessueldo],
      prommesescomision: [this.dataform.prommesescomision],
      diascomerciales: [this.dataform.diascomerciales],
      horasmes: [this.dataform.horasmes],
      horasdia: [this.dataform.horasdia],
      valida_salariomin: [this.dataform.valida_salariomin == null ? false : true],
      bono_rendimiento_pymes_segun_evaluacion: [this.dataform.bono_rendimiento_pymes_segun_evaluacion == null ? false : true],

      topemonto_asn1: [this.dataform.topemonto_asn1],
      porcentaje_asn1: [this.dataform.porcentaje_asn1],
      topemonto_asn2: [this.dataform.topemonto_asn2],
      porcentaje_asn2: [this.dataform.porcentaje_asn2],
      topemonto_asn3: [this.dataform.topemonto_asn3],
      porcentaje_asn3: [this.dataform.porcentaje_asn3],

      negativos: [this.dataform.negativos == null ? false : true],
      stock_seguridad: [this.dataform.stock_seguridad == null ? false : true],
      codmoneda_costeo: [this.dataform.codmoneda_costeo],
      ctsc1_descripcion: [this.dataform.ctsc1_descripcion],
      ctsc2_descripcion: [this.dataform.ctsc2_descripcion],
      codtarifaajuste: [this.dataform.codtarifaajuste],

      ctacredfiscal: [this.dataform.ctacredfiscal],
      ctadebfiscal: [this.dataform.ctadebfiscal],
      codcuentaajustes: [this.dataform.codcuentaajustes],
      codcuentaajustesmn: [this.dataform.codcuentaajustesmn],
      codctautilidad: [this.dataform.codctautilidad],
      codctaperdida: [this.dataform.codctaperdida],
      iue: [this.dataform.iue],
      monedae: [this.dataform.monedae],
      resp_lc_ci: [this.dataform.resp_lc_ci],
      resp_lv_ci: [this.dataform.resp_lv_ci],
      resp_lc_nombre: [this.dataform.resp_lc_nombre],
      resp_lv_nombre: [this.dataform.resp_lv_nombre],
      ciudad_reportes_conta: [this.dataform.ciudad_reportes_conta],
      monto_rnd100011: [this.dataform.monto_rnd100011],
      monto_maximo_facturas_sin_nombre: [this.dataform.monto_maximo_facturas_sin_nombre],

      maxcomplementarias_sindesc: [this.dataform.maxcomplementarias_sindesc],
      nronombrenit: [this.dataform.nronombrenit],
      maxurgentes: [this.dataform.maxurgentes],
      maxurgentes_dia: [this.dataform.maxurgentes_dia],
      maxitemurgentes: [this.dataform.maxitemurgentes],
      duracion_habilitado: [this.dataform.duracion_habilitado],
      dias_alerta_dosificacion: [this.dataform.dias_alerta_dosificacion],
      diasextrapp: [this.dataform.diasextrapp],
      codplanpago_reversion: [this.dataform.codplanpago_reversion],
      dias_igualacion: [this.dataform.dias_igualacion],
      maxdiaspp: [this.dataform.maxdiaspp],
      estandardiaspp: [this.dataform.estandardiaspp],
      factura_imprime_labels: [this.dataform.factura_imprime_labels == null ? false : true],

      proforma_reserva: [this.dataform.proforma_reserva == null ? false : true],
      rev_automaticas: [this.dataform.rev_automaticas == null ? false : true],
      clientevendedor: [this.dataform.clientevendedor == null ? false : true],
      forzar_etiqueta: [this.dataform.forzar_etiqueta == null ? false : true],
      permitir_items_repetidos: [this.dataform.permitir_items_repetidos == null ? false : true],
      distribuir_desc_extra_en_factura: [this.dataform.distribuir_desc_extra_en_factura == null ? false : true],
      cambiar_credito_morosos: [this.dataform.cambiar_credito_morosos == null ? false : true],
      valida_cobertura: [this.dataform.valida_cobertura == null ? false : true],
      dias_sin_compra: [this.dataform.dias_sin_compra],
      dias_mora_limite_revertir_credito: [this.dataform.dias_mora_limite_revertir_credito],
      nro_reversiones_pendientes: [this.dataform.nro_reversiones_pendientes],

      preg_cont_ventascontado: [this.dataform.preg_cont_ventascontado == null ? false : true],
      preg_cont_ventascredito: [this.dataform.preg_cont_ventascredito == null ? false : true],
      preg_cont_cobranza: [this.dataform.preg_cont_cobranza == null ? false : true],
      preg_cont_notamov: [this.dataform.preg_cont_notamov == null ? false : true],
      preg_cont_depositos: [this.dataform.preg_cont_depositos == null ? false : true],
      preg_cont_retiros: [this.dataform.preg_cont_retiros == null ? false : true],
      preg_cont_movfondos: [this.dataform.preg_cont_movfondos == null ? false : true],
      preg_cont_cheques: [this.dataform.preg_cont_cheques == null ? false : true],
      preg_cont_transferencias: [this.dataform.preg_cont_transferencias == null ? false : true],
      preg_cont_compras: [this.dataform.preg_cont_compras == null ? false : true],
      preg_cont_pagos: [this.dataform.preg_cont_pagos == null ? false : true],
      preg_cont_trasladoaf: [this.dataform.preg_cont_trasladoaf == null ? false : true],
      preg_cont_bajaaf: [this.dataform.preg_cont_trasladoaf == null ? false : true],

      porcentaje_afp: [this.dataform.porcentaje_afp],
      porcentaje_cns: [this.dataform.porcentaje_cns],
      porcentaje_fonvis: [this.dataform.porcentaje_fonvis],
      porcentaje_infocal: [this.dataform.porcentaje_infocal],

      porcencomventas: [this.dataform.porcencomventas],
      porcencomcbzas: [this.dataform.porcencomcbzas],
      mingarantizado: [this.dataform.mingarantizado],
      comnoviajantes: [this.dataform.comnoviajantes == null ? false : true],
    });
  }

  submitDataUpdateParamEmpresa() {
    let data = this.FormularioDataParamEmpresa.value;
    console.log(data);

    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adusuario Update";
    return this.api.update('/seg_adm/mant/adparametros/' + this.BD_storage, data)
      .subscribe({
        next: (datav) => {
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          this.dataformupdate = datav;
          // console.log('data', datav);
          this._snackBar.open('Se ha editado correctamente!', 'Ok', {
            duration: 3000,
          });
          // location.reload();
        },

        error: (err: any) => {
          console.log(err, this.errorMessage);
          this.toastr.error('! NO SE ACTUALIZO EXITOSAMENTE !');
        },
        complete: () => { }
      })
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
