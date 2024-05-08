import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { pePersona } from '@services/modelos/objetos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { DatePipe } from '@angular/common'
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
@Component({
  selector: 'app-usuario-create',
  templateUrl: './usuario-create.component.html',
  styleUrls: ['./usuario-create.component.scss'],
})
export class UsuarioCreateComponent implements OnInit {

  public pepersona: any = [];
  public serol: any = [];
  public dataform: any = '';
  public fecha_actual = new Date();
  public hora_actual = new Date();
  public loading: boolean = false;
  public errorMessage;
  public ventana = "usuario-create"
  public detalle;
  public tipo;
  public pepersona_get;

  myControl = new FormControl<string | pePersona>('');
  options: pePersona[] = [];
  filteredOptions: Observable<pePersona[]>;

  FormularioData: FormGroup;

  userConn: any;
  usuario_logueado: any;

  constructor(private _formBuilder: FormBuilder, public log_module: LogService, public _snackBar: MatSnackBar, private api: ApiService,
    private toastr: ToastrService, public dialogRef: MatDialogRef<UsuarioCreateComponent>, private datePipe: DatePipe) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  createForm(): FormGroup {

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      login: [this.dataform.login, Validators.compose([Validators.required])],
      password: [this.dataform.password, Validators.compose([Validators.required])],
      persona: [this.dataform.persona],
      vencimiento: [this.datePipe.transform(this.dataform.vencimiento, "yyyy-MM-dd")],
      activo: [this.dataform.activo],
      codrol: [this.dataform.codrol],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      correo: [this.dataform.correo],
      password_siaw: [this.dataform.password_siaw],
      fechareg_siaw: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuario_logueado],
    });
  }

  ngOnInit(): void {
    this.getPersonaCatalogo();
    this.getAllRol();
  }

  private _filter(name: string): pePersona[] {
    const filterValue = name.toLowerCase();

    return this.pepersona.filter(option => option.nombre1.toLowerCase().includes(filterValue));
  }

  async getPersonaCatalogo() {
    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/pers_plan/mant/pepersona/catalogo/";
    return this.api.getAll('/pers_plan/mant/pepersona/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.pepersona = datav;
          // console.log('data', datav);
        },
        error: (err: any) => {
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }

  displayFn(pePersona: pePersona): string {
    return pePersona && pePersona.nombre1 ? pePersona.nombre1 : '';
  }

  getAllRol() {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/serol/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.serol = datav;
        },

        error: (err: any) => {
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }

  submitData() {
    let data = this.FormularioData.value;
    console.log(data);

    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adusuario";
    return this.api.create("/seg_adm/mant/adusuario/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.serol = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          console.log('data', datav);
          this.toastr.error('! GUARDADO !');
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 1500,
          });

          location.reload();
        },

        error: (err: any) => {
          console.log(err, this.errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
