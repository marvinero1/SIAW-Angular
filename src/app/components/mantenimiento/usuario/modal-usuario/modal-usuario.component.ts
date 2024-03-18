import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { adUsuario } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ServicioUsuarioService } from '../service-usuario/servicio-usuario.service';
@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.scss']
})
  
export class ModalUsuarioComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent){
    console.log("Hola Lola ENTER");
    
    this.mandarUsuario();
  };

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarUsuario();
  };

  usuario_get:any=[];
  public usuario_view: string;
  userConn: string;

  displayedColumns = ['login','descripcion'];

  dataSource = new MatTableDataSource<adUsuario>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: adUsuario[] = [];
  filteredOptions: Observable<adUsuario[]>;
  myControlCodigo = new FormControl<string | adUsuario>('');
  myControlDescripcion = new FormControl<string | adUsuario>('');

  constructor(private api:ApiService, public dialogRef: MatDialogRef<ModalUsuarioComponent>,
    private servicioUsuario: ServicioUsuarioService) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  }

  ngOnInit(){
    this.filteredOptions = this.myControlCodigo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.login;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.filteredOptions = this.myControlDescripcion.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.correo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.getUsuario();
  }

  private _filter(name: string): adUsuario[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.login.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: adUsuario): string {
    return user && user.correo ? user.correo : '';
  }

  getUsuario(){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/adusuario/catalogo/"
    return this.api.getAll('/seg_adm/mant/adusuario/catalogo/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.usuario_get = datav;
          console.log(this.usuario_get);

          this.dataSource = new MatTableDataSource(this.usuario_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarUsuario(){
    this.servicioUsuario.disparadorDeUsuarios.emit({
      usuario:this.usuario_view,
    });

   this.close();
  }

  getDescripcionView(element){
    this.usuario_view = element;
    console.log(this.usuario_view);
  }

  close(){
    this.dialogRef.close();
  }
}
