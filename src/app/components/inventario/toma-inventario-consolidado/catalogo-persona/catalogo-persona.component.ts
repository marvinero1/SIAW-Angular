import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PersonaCatalogoComponent } from '@components/mantenimiento/persona-catalogo/persona-catalogo.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { pePersona } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-catalogo-persona',
  templateUrl: './catalogo-persona.component.html',
  styleUrls: ['./catalogo-persona.component.scss']
})
export class CatalogoPersonaComponent implements OnInit {

  persona_get: any = [];
  public persona_view: any = [];
  userConn: any;
  add_person: any = [];
  array_new: any = [];
  cod_grupo: any = [];

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource<pePersona>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: pePersona[] = [];
  filteredOptions: Observable<pePersona[]>;
  myControlCodigo = new FormControl<string | pePersona>('');
  myControlDescrip = new FormControl<string | pePersona>('');

  public ventana = "grupo-inventario"
  public detalle = "grupo-inventario-create";
  public tipo = "grupo-inventario-CREATE";

  constructor(private api: ApiService, public dialogRef: MatDialogRef<PersonaCatalogoComponent>,
    public log_module: LogService, private spinner: NgxSpinnerService, @Inject(MAT_DIALOG_DATA) public codigo_grupo: any,
    private toastr: ToastrService,) {

    this.cod_grupo = this.codigo_grupo.codigo_grupo;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

  }

  ngOnInit() {
    this.getPersona();

    this.filteredOptions = this.myControlCodigo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.filteredOptions = this.myControlDescrip.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre1;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  private _filter(name: string): pePersona[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.nombre1.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: pePersona): string {
    return user && user.nombre1 ? user.nombre1 : '';
  }

  getPersona() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/pers_plan/mant/pepersona/catalogo/"
    return this.api.getAll('/pers_plan/mant/pepersona/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.persona_get = datav;
          console.log(this.persona_get);

          this.dataSource = new MatTableDataSource(this.persona_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  guardarIntegrantes(codigo) {
    let data: any = {
      "codgrupoper": this.cod_grupo,
      "codpersona": codigo,
    };

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /inventario/mant/ingrupoper1/";
    return this.api.create("/inventario/mant/ingrupoper1/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.add_person = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.spinner.show();

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);

          this.toastr.success('Guardado con Exito! 🎉');
          this.close();
        },
        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  getDescripcionView(element) {
    this.persona_view = element;
    console.log(this.persona_view);
  }

  close() {
    this.dialogRef.close();
  }

}