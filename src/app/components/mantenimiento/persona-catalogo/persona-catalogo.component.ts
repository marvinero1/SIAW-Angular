import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { pePersona } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ServicePersonaService } from './service-persona/service-persona.service';

@Component({
  selector: 'app-persona-catalogo',
  templateUrl: './persona-catalogo.component.html',
  styleUrls: ['./persona-catalogo.component.scss']
})
export class PersonaCatalogoComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarAlmacen();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarAlmacen();
  };

  persona_get: any = [];
  public persona_view: any = [];
  userConn: any;

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource<pePersona>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: pePersona[] = [];
  filteredOptions: Observable<pePersona[]>;
  myControlCodigo = new FormControl<string | pePersona>('');
  myControlDescrip = new FormControl<string | pePersona>('');

  constructor(private api: ApiService, public dialogRef: MatDialogRef<PersonaCatalogoComponent>,
    private servicioPersona: ServicePersonaService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.getPersona();
  }

  ngOnInit() {

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

  mandarAlmacen() {
    this.servicioPersona.disparadorDePersonas.emit({
      persona: this.persona_view,
    });

    this.close();
  }

  getDescripcionView(element) {
    this.persona_view = element;
    console.log(this.persona_view);
  }

  close() {
    this.dialogRef.close();
  }
}
