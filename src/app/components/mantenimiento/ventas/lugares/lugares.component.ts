import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { CatalogoLugarComponent } from './catalogo-lugar/catalogo-lugar.component';
import { LugarService } from './lugar-services/lugar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { DatePipe } from '@angular/common';
import { ModalZonaComponent } from '../modal-zona/modal-zona.component';
import { PersonaCatalogoComponent } from '@components/mantenimiento/persona-catalogo/persona-catalogo.component';
import { ServicePersonaService } from '@components/mantenimiento/persona-catalogo/service-persona/service-persona.service';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ServiciozonaService } from '../serviciozona/serviciozona.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.scss']
})
export class LugaresComponent implements OnInit, AfterViewInit {

  @HostListener("document:keydown.F4", []) unloadHandler(event: KeyboardEvent) {
    console.log("Hola Lola F4");
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "personaCatalogo":
          this.catalogoPersonas();
          break;
        case "zonaCatalogo":
          this.catalogoZona();
          break;
      }
    }
  };

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  codigo: any;
  dataform: any = '';
  usuarioLogueado: any;
  cod_vendedor_cliente_modal: any;
  userConn: any;


  lugar_get: any = [];
  lugar_save: any = [];
  pepersona_catalogo: any = [];
  vezona_catalogo: any = [];
  persona_get: any = [];
  persona_get_id: any = [];
  vezona: any = [];
  vezona_id: any = [];


  nombre_ventana: string = "abmvelugar.vb";
  public ventana = "Lugar"
  public detalle = "lugar-create";
  public tipo = "lugar-CREATE";

  constructor(public dialog: MatDialog, private api: ApiService, public lugar_service: LugarService, private spinner: NgxSpinnerService,
    public _snackBar: MatSnackBar, public log_module: LogService, private messageService: MessageService, private _formBuilder: FormBuilder,
    public nombre_ventana_service: NombreVentanaService, private datePipe: DatePipe, public servicioZona: ServiciozonaService,
    private servicioPersona: ServicePersonaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);

    this.FormularioData = this.createForm();
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {

    this.servicioPersona.disparadorDePersonas.subscribe(data => {
      console.log("Recibiendo Persona: ", data);
      this.pepersona_catalogo = data.persona;
    });

    this.servicioZona.disparadorDeZonas.subscribe(data => {
      console.log("Recibiendo Zona: ", data);
      this.vezona_catalogo = data.zona;
    });

    this.lugar_service.disparadorDeLugares.subscribe(data => {
      console.log("Recibiendo Lugares: ", data);
      this.cod_vendedor_cliente_modal = data.lugar;

      console.log(this.cod_vendedor_cliente_modal);
      this.getByIdLugar(this.cod_vendedor_cliente_modal);
    });

    this.getPersona();
    this.getZona();
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      direccion: [this.dataform.direccion, Validators.compose([Validators.required])],
      codpersona: [this.dataform.codpersona],
      personaDescrip: [this.dataform.personaDescrip],
      obs: [this.dataform.obs],
      codzona: [this.dataform.codzona],
      zonaDescrip: [this.dataform.zonaDescrip],
      latitud: [this.dataform.latitud],
      longitud: [this.dataform.longitud],
      puntear: [this.dataform.puntear === null ? false : true],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData() {
    const data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/velugar/";
    return this.api.create("/venta/mant/velugar/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.lugar_save = datav;

          console.log('data', datav);
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! SE GUARDO EXITOSAMENTE !' })
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 2000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getByIdLugar(codigo) {
    let errorMessage = "La Ruta  presenta fallos al hacer peticion GET --catalogoVendedor";
    return this.api.getAll('/venta/mant/velugar/' + this.userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.lugar_get = datav;
          console.log(this.lugar_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  limpiar() {
    this.codigo = '';
    this.lugar_get.codigo = '';
    this.lugar_get.codpersona = '';
    this.lugar_get.codzona = '';
    this.lugar_get.descripcion = '';
    this.lugar_get.direccion = '';
    this.lugar_get.latitud = '';
    this.lugar_get.longitud = '';
    this.lugar_get.obs = '';
    this.lugar_get.personaDescrip = '';
    this.lugar_get.puntear = '';
    this.lugar_get.zonaDescrip = '';
  }

  submitDataEdit() {
    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/velugar/ Update";
    return this.api.update('/venta/mant/velugar/' + this.userConn + "/" + this.lugar_get.codigo, data)
      .subscribe({
        next: (datav) => {
          this.lugar_save = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! SE EDITO EXITOSAMENTE !' })
          location.reload();
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  eliminar() {
    let ventana = "Lugar"
    let detalle = "lugar-DELETE";
    let tipo = "lugar-DELETE";

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: this.lugar_get.codigo },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/venta/mant/velugar/' + this.userConn + "/" + this.lugar_get.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(ventana, detalle, tipo, "", "");
              this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! ELIMINADO EXITOSAMENTE !' })
              this.limpiar();
            },
            error: (err: any) => {
              console.log(err, errorMessage);
            },
            complete: () => { }
          })
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO !' });
      }
    });
  }

  getPersona() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/pers_plan/mant/pepersona/catalogo/"
    return this.api.getAll('/pers_plan/mant/pepersona/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.persona_get = datav;
          // console.log(this.persona_get);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getZona() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vezona/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vezona = datav;
          console.log('data', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getZonaID(id) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vezona/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.vezona_id = datav;
          console.log('data', datav);

          this.lugar_get.zonaDescrip = this.vezona_id.descripcion
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getPersonaID(id) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/pers_plan/mant/pepersona/"
    return this.api.getAll('/pers_plan/mant/pepersona/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.persona_get_id = datav;
          console.log(this.persona_get_id);
          let nomnbre_completo = this.persona_get_id.nombre1 + this.persona_get_id.nombre1 + this.persona_get_id.apellido1 + this.persona_get_id.apellido2;
          this.lugar_get.personaDescrip = nomnbre_completo;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeavePersona(event: any) {
    const inputValue = event.target.value;
    let miNumero = parseInt(inputValue, 10);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.persona_get.some(objeto => objeto.codigo === miNumero);


    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      this.getPersonaID(miNumero);
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', miNumero);
  }

  onLeaveZona(event: any) {
    const inputValue = event.target.value;

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.vezona.some(objeto => objeto.codigo === inputValue);


    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      this.getZonaID(inputValue);
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', inputValue);
  }

  catalogoLugares(): void {
    this.dialog.open(CatalogoLugarComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  catalogoPersonas(): void {
    this.dialog.open(PersonaCatalogoComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  catalogoZona(): void {
    this.dialog.open(ModalZonaComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
