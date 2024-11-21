import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CatalogoProformasComponent } from '../../proforma/catalogo-proformas/catalogo-proformas.component';
import { ServicioCatalogoProformasService } from '../../proforma/sevicio-catalogo-proformas/servicio-catalogo-proformas.service';
import { CatalogoFacturasService } from '../../facturas/catalogo-facturas/servicio-catalogo-facturas/catalogo-facturas.service';
import { CatalogoFacturasComponent } from '../../facturas/catalogo-facturas/catalogo-facturas.component';
import { ServicioTransfeAProformaService } from '../../proforma/modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-tranferirMostradorTiendas',
  templateUrl: './tranferirMostradorTiendas.component.html',
  styleUrls: ['./tranferirMostradorTiendas.component.scss']
})
export class TranferirMostradorTiendasComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler5(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "numero_id_proformas":
          this.transferirProforma();
          break;
        case "numero_id_facturas":
          this.transferirFacturas();
          break;
      }
    }
  };

  transferir_get: any = [];
  id_numero_id_proforma: any = [];
  id_factura:any;
  id_proformas_descripcion:string="";
  id_factura_descripcion:string="";

  proforma_get: any = [];
  facturas_get: any = [];

  id_proformas: any;
  numero_id_proformas: any;
  numero_id_facturas: any;
  BD_storage: any;
  userConn: any;

  isCheckedProformas: boolean = true;
  isCheckedCotizaciones: boolean = false;

  input_num_id_proformas

  constructor(public dialog: MatDialog, private api: ApiService, public dialogRef: MatDialogRef<TranferirMostradorTiendasComponent>,
    private spinner: NgxSpinnerService, private toastr: ToastrService, public servicioCatalogoProformas: ServicioCatalogoProformasService,
    public servicioCatalogoFacturas: CatalogoFacturasService, private servicioTransfeProformaCotizacion: ServicioTransfeAProformaService) {

    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    //CatalogoProforma
    this.servicioCatalogoProformas.disparadorDeIDProforma.subscribe(data => {
      console.log("Recibiendo Proforma: ", data);
      this.id_numero_id_proforma = data;
      this.id_proformas = data.proforma.id;
      this.id_proformas_descripcion = data.proforma.descripcion;
    });
    

    //CatalogoFacturacion
    this.servicioCatalogoFacturas.disparadorDeIDFacturas.subscribe(data => {
      console.log("Recibiendo ID Factura: ", data);

      this.id_factura = data.factura.id;
      this.id_factura_descripcion = data.factura.descripcion;
    });

    this.getProforma();
    this.getFacturas();
  }

  transferirProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/transfDatosProforma/";

    return this.api.getAll('/venta/transac/docvefacturamos_cufd/transfProforma/' + this.userConn + "/" + this.id_proformas + "/" + this.numero_id_proformas)
      .subscribe({
        next: (datav) => {
          this.transferir_get = datav;
          console.log("🚀 ~ TranferirMostradorTiendasComponent ~ transferirProforma ~ transferir_get:", this.transferir_get);
          const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
            width: 'auto',
            height: 'auto',
            data: { mensaje_dialog: "¿ Esta Seguro de Transferir a la Proforma Actual ?, Se reemplazara el contenido de la proforma actual!" },
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((result: Boolean) => {
            if (result) {
              this.toastr.success('! TRANSFERENCIA EN PROGESO ! ✅');
              this.transferirProformaAProforma(this.transferir_get);
              this.spinner.show();
              setTimeout(() => {
                this.spinner.hide();
              }, 500);
              this.close();
            } else {
              this.toastr.error('! TCANCELADO ! ❌');
            }
          });
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! TRANSFERENCIA FALLO ! ❌');
        },
        complete: () => {
          this.close();
        }
      })
  }

  transferirFacturas() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/docvefacturamos_cufd/transfFactura/";

    return this.api.getAll('/venta/transac/docvefacturamos_cufd/transfFactura/' + this.userConn + "/" + this.id_factura + "/" + this.numero_id_facturas)
      .subscribe({
        next: (datav) => {
          this.transferir_get = datav;
          console.log(this.transferir_get);
          this.toastr.success('! TRANSFERENCIA EN PROGESO ! ✅');

          this.transferirAProformaFactura(this.transferir_get);
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
          this.close();
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! TRANSFERENCIA FALLO ! ❌');
        },
        complete: () => { }
      })
  }

  proformaHabilitar() {
    console.log(this.isCheckedCotizaciones);

    if (!this.isCheckedCotizaciones) {
      this.isCheckedProformas = true;
    } else {
      this.isCheckedProformas = false;
      this.id_proformas = "";
      this.id_proformas_descripcion = "";
    }
  }

  cotizacionHabilitar() {
    console.log(this.isCheckedProformas);

    if (!this.isCheckedProformas) {
      this.isCheckedCotizaciones = true;
      this.id_factura = "";
    } else {
      this.isCheckedCotizaciones = false;
      
      this.id_factura_descripcion = "";
    }
  }

  transferirProformaAProforma(proforma_get) {
    this.servicioTransfeProformaCotizacion.disparadorDeProformaTransferir.emit({
      proforma_transferir: proforma_get,
    });
  }

  transferirAProformaFactura(factura_get) {
    this.servicioTransfeProformaCotizacion.disparadorDeFacturaTransferir.emit({
      proforma_transferir: factura_get,
    });
  }

  getProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET - /venta/mant/venumeracion/catalogo/ 2";
    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + "2")
      .subscribe({
        next: (datav) => {
          this.proforma_get = datav;
          // console.log(this.proforma_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getFacturas() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/venumeracion/catalogo/ 1";
    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + "1")
      .subscribe({
        next: (datav) => {
          this.facturas_get = datav;
          // console.log(this.facturas_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveIDProformas(event: any) {
    console.log(this.proforma_get);
    const inputValue = event.target.value;

    let cadena = inputValue.toString();
    console.log(cadena);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.proforma_get.some(objeto => objeto.id === cadena.toUpperCase());

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = cadena;
    }
  }

  onLeaveIDFacturas(event: any) {
    console.log(this.facturas_get);
    const inputValue = event.target.value;

    let cadena = inputValue.toString();
    console.log(cadena);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.facturas_get.some(objeto => objeto.id === cadena.toUpperCase());

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = cadena;
    }
  }

  modalCatalogoProformas(): void {
    this.dialog.open(CatalogoProformasComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalCatalogoCotizaciones(): void {
    this.dialog.open(CatalogoFacturasComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  close() {
    this.dialogRef.close();
  }
}
