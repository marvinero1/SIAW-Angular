import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogoInventarioComponent } from '../catalogo-inventario/catalogo-inventario.component';
import { ServicioInventarioService } from '../servicio-inventario/servicio-inventario.service';
import { PersonaCatalogoComponent } from '@components/mantenimiento/persona-catalogo/persona-catalogo.component';
import { ServicePersonaService } from '@components/mantenimiento/persona-catalogo/service-persona/service-persona.service';
import { ApiService } from '@services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';

@Component({
  selector: 'app-crear-toma-inventario',
  templateUrl: './crear-toma-inventario.component.html',
  styleUrls: ['./crear-toma-inventario.component.scss']
})
export class CrearTomaInventarioComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  userConn: any;
  num_mas_mas: number;

  inventario_get: any = [];
  inventario_get_leave: any = [];
  persona_get: any = [];
  persona_get_leave: any = [];
  almacen_leave_id: any = [];
  almacen_get: any = [];
  inventario_save: any = [];
  almacen_leave: any = [];
  nombre_ventana: string = "prgcrearinv.vb";

  public ventana = "Crear Toma Inventario"
  public detalle = "CrearTomaInventario-create";
  public tipo = "CrearTomaInventario-CREATE";

  constructor(private api: ApiService, public dialog: MatDialog, public servicioInventario: ServicioInventarioService,
    public servicioPersona: ServicePersonaService, public servicioAlmacen: ServicioalmacenService, private _formBuilder: FormBuilder,
    private datePipe: DatePipe, private toastr: ToastrService, public log_module: LogService,
    public nombre_ventana_service: NombreVentanaService) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.getInventarios();
    this.getAlmacen();
    this.getPersonaAll();

    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.api.getRolUserParaVentana(this.nombre_ventana);

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.servicioInventario.disparadorDeInventarios.subscribe(data => {
      console.log("Recibiendo Inventario: ", data);
      this.inventario_get = data.inventario;

      let mas = this.inventario_get.nroactual;
      this.num_mas_mas = mas + 1;
      console.log(this.num_mas_mas);
    });

    this.servicioPersona.disparadorDePersonas.subscribe(data => {
      console.log("Recibiendo Persona: ", data);
      this.persona_get = data.persona;
    });

    this.servicioAlmacen.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.almacen_get = data.almacen;
    });
  }

  createForm(): FormGroup {
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: [this.dataform.numeroid, Validators.compose([Validators.required])],
      fechainicio: [this.datePipe.transform(this.dataform.fechainicio, "yyyy-MM-dd")],
      fechafin: [this.datePipe.transform(this.dataform.fechafin, "yyyy-MM-dd")],
      obs: [this.dataform.obs],
      codpersona: [this.dataform.codpersona, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
      abierto: [true],
    });
  }

  submitData() {
    let num_mas = this.inventario_get.nroactual
    let num_mas_mas = num_mas + 1;

    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /inventario/oper/prgcrearinv/";
    console.log(data);

    return this.api.create("/inventario/oper/prgcrearinv/" + this.userConn + "/" + this.inventario_get.id + "/" + num_mas_mas, data)
      .subscribe({
        next: (datav) => {
          this.inventario_save = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
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

  onLeaveIDInventario(event: any) {
    const inputValue = event.target.value;
    let Mayusucalas = inputValue.toUpperCase();

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.inventario_get_leave.some(objeto => objeto.id === Mayusucalas);
    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      event.target.value = Mayusucalas;
    }
    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', Mayusucalas);
  }

  getInventarios() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/oper/prgcrearinv/catalogointipoinv/"
    return this.api.getAll('/inventario/oper/prgcrearinv/catalogointipoinv/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.inventario_get_leave = datav;
          console.log(this.inventario_get_leave);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacen() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.almacen_leave = datav;
          console.log(this.almacen_leave);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveAlmacen(event: any) {
    const inputValue = event.target.value;
    let num = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.almacen_leave.some(objeto => objeto.codigo === num);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      event.target.value = num;
      this.getAlmacenByID(num);
    }
    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', num);
  }

  getAlmacenByID(id) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/inalmacen/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.almacen_leave_id = datav;
          console.log(this.almacen_leave_id);

          this.almacen_get.descripcion = this.almacen_leave_id.descripcion;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveResponsable(event: any) {
    const inputValue = event.target.value;
    let num = Number(inputValue);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.persona_get.some(objeto => objeto.codigo === num);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      event.target.value = num;

      this.getPersona(num);

    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', num);
  }

  getPersonaAll() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/pers_plan/mant/pepersona/catalogo/"
    return this.api.getAll('/pers_plan/mant/pepersona/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.persona_get = datav;
          console.log(this.persona_get);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getPersona(id) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/pers_plan/mant/pepersona/catalogo/"
    return this.api.getAll('/pers_plan/mant/pepersona/' + this.userConn + '/' + id)
      .subscribe({
        next: (datav) => {
          this.persona_get = datav;
          console.log(this.persona_get);

          let nombre = this.persona_get.nombre1;
          let apellido = this.persona_get.apellido1;

          this.persona_get.descrip = nombre + " " + apellido;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  modalInventario(): void {
    this.dialog.open(CatalogoInventarioComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { almacen: "almacen" }
    });
  }

  modalPersona(): void {
    this.dialog.open(PersonaCatalogoComponent, {
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
