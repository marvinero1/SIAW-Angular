import { AfterContentInit, Component, HostListener, OnInit } from '@angular/core';
import { CatalogoPuntoVentaComponent } from './catalogo-punto-venta/catalogo-punto-venta.component';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { PuntoventaService } from './servicio-punto-venta/puntoventa.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProvinciasCatalogoComponent } from '@components/mantenimiento/administracion/provinciadptopais/provincias-catalogo/provincias-catalogo.component';
import { ProvinciasService } from '@components/mantenimiento/administracion/provinciadptopais/services-provincias/provincias.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-punto-venta',
  templateUrl: './punto-venta.component.html',
  styleUrls: ['./punto-venta.component.scss']
})
export class PuntoVentaComponent implements OnInit, AfterContentInit {

  @HostListener("document:keydown.F4", []) unloadHandler(event: KeyboardEvent) {
    console.log("Hola Lola F4");
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "procinciaCatalogo":
          this.catalogoProvincia();
          break;
      }
    }
  };

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  usuarioLogueado: any;
  userConn: any;

  cod_pto_venta: any = [];
  cod_pto_venta_provincia: string;
  provincia_get: any = [];
  provincia_set: any = [];
  punto_venta_save: any = [];
  provincia: any = [];
  provincia_id: any = [];
  nombre_ciudad: string;

  nombre_ventana: string = "abmveptoventa.vb";
  public ventana = "Punto de Venta"
  public detalle = "punto-venta-create";
  public tipo = "punto-venta-CREATE";

  constructor(private api: ApiService, public dialog: MatDialog,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService,
    public servicesPuntoVenta: PuntoventaService, private _formBuilder: FormBuilder, private datePipe: DatePipe,
    public provinciaService: ProvinciasService, private spinner: NgxSpinnerService, public _snackBar: MatSnackBar,) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);

    this.FormularioData = this.createForm();
    // this.FormularioData.get('codprovincia').disable();
  }

  ngOnInit() {
    this.provinciaService.disparadorDeProvincias.subscribe(data => {
      console.log("Recibiendo Provincia: ", data);
      this.provincia_get = data.provincia;
      this.cod_pto_venta_provincia = data.provincia.dato1;
      this.nombre_ciudad = data.provincia.dato3;
    });

    this.servicesPuntoVenta.disparadorDePuntosVenta.subscribe(data => {
      console.log("Recibiendo Pto Venta: ", data);
      this.cod_pto_venta = data.punto_venta;
      this.cod_pto_venta_provincia = data.punto_venta.codprovincia;
      this.getProvinciaId(this.cod_pto_venta_provincia)
    });
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.getProvincia();
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.maxLength(3), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      tipo: [this.dataform.tipo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      abreviacion: [this.dataform.abreviacion, Validators.compose([Validators.required])],
      ubicacion: [this.dataform.ubicacion],
      codprovincia: [this.dataform.codprovincia, Validators.compose([Validators.required])],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
      permitido: [this.dataform.codigo],
      ptolocal: [true],
    });
  }

  submitData() {
    const data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /inventario/mant/inalmacen/";
    return this.api.create("/venta/mant/veptoventa/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.punto_venta_save = datav;

          console.log('data', datav);
          if (this.punto_venta_save.resp == 204) {
            this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
            this.spinner.show();
            setTimeout(() => {
              this.spinner.hide();
            }, 2000);
            this.toastr.success('! SE EDITO EXITOSAMENTE !');
            this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
              duration: 3000,
            });
            location.reload();
          }
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  catalogoProvincia() {
    this.dialog.open(ProvinciasCatalogoComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  update() {
    let data = this.FormularioData.value;

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/veptoventa/ Update";
    return this.api.update('/venta/mant/veptoventa/' + this.userConn + "/" + this.cod_pto_venta.codigo, data)
      .subscribe({
        next: (datav) => {
          this.punto_venta_save = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          location.reload();
        },

        error: (err: any) => {
          this.toastr.error('! NO SE EDITO !');
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  eliminar() {
    let ventana = "Punto de Venta"
    let detalle = "punto-venta-DELETE";
    let tipo = "punto-venta-DELETE";

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: this.cod_pto_venta.codigo },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/venta/mant/veptoventa/' + this.userConn + "/" + this.cod_pto_venta.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(ventana, detalle, tipo, "", "");

              this.toastr.success('!ELIMINADO EXITOSAMENTE!');
              location.reload();
            },
            error: (err: any) => {
              console.log(err, errorMessage);
              this.toastr.error('! NO ELIMINADO !');
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  limpiar() {
    this.cod_pto_venta.codigo = "";
    this.cod_pto_venta.descripcion = "";
    this.cod_pto_venta.abreviacion = "";
    this.cod_pto_venta.tipo = "";
    this.provincia_get.dato1 = "";
    this.provincia_get.dato2 = "";
    this.cod_pto_venta.permitido = "";
    this.cod_pto_venta_provincia = "";
    this.nombre_ciudad = "";
    this.cod_pto_venta.ubicacion = "";
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  modalClientes() {
    this.dialog.open(CatalogoPuntoVentaComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  getProvincia() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/seg_adm/mant/adprovincia/catalogo_depto/"
    return this.api.getAll('/seg_adm/mant/adprovincia/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.provincia_set = datav;
          console.log(this.provincia_set);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getProvinciaId(id: any) {
    return this.api.getAll('/seg_adm/mant/adprovincia/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.provincia_id = datav;
          console.log('data', this.provincia_id);

          // this.provincia_get.dato2 = this.provincia_id.nombre;
          this.provincia_get.dato2 = this.provincia_id.nombre;
          this.nombre_ciudad = this.provincia_id.coddepto;
        },

        error: (err: any) => {
          console.log(err);
        },
        complete: () => { }
      })
  }

  onLeaveProvincia(event: any) {
    const inputValue = event.target.value;
    console.log(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.provincia_set.some(objeto => objeto.codigo === inputValue.toUpperCase());

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      this.getProvinciaId(inputValue);
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', inputValue);
  }
}
