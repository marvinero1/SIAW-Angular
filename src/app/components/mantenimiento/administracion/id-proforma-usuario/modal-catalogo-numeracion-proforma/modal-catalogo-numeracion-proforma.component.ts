import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { IDProforma } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ServicioidproformaService } from '../servicioidproforma.service';
@Component({
  selector: 'app-modal-catalogo-numeracion-proforma',
  templateUrl: './modal-catalogo-numeracion-proforma.component.html',
  styleUrls: ['./modal-catalogo-numeracion-proforma.component.scss']
})
export class ModalCatalogoNumeracionProformaComponent implements OnInit {
  
  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarAlmacen();
  };

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarAlmacen();
  };

  idproforma_get:any=[];
  public agencia_view: string;
  userConn: string;

  displayedColumns = ['id','descripcion'];

  dataSource = new MatTableDataSource<IDProforma>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: IDProforma[] = [];
  filteredOptions: Observable<IDProforma[]>;
  myControlCodigo = new FormControl<string | IDProforma>('');
  myControlDescripcion = new FormControl<string | IDProforma>('');

  constructor(private api:ApiService, public dialogRef: MatDialogRef<ModalCatalogoNumeracionProformaComponent>,
    private servicioIDProforma: ServicioidproformaService) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    
  }

  ngOnInit(){
    this.getAllNumeracionProforma();

    this.filteredOptions = this.myControlCodigo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.filteredOptions = this.myControlDescripcion.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.descripcion;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  private _filter(name: string): IDProforma[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: IDProforma): string {
    return user && user.id ? user.id : '';
  }

  getAllNumeracionProforma(){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/seg_adm/mant/adusuario_idproforma/catalogoVenumeracionProf/"
    return this.api.getAll('/seg_adm/mant/adusuario_idproforma/catalogoVenumeracionProf/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.idproforma_get = datav;
          console.log(this.idproforma_get);

          this.dataSource = new MatTableDataSource(this.idproforma_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarAlmacen(){
    this.servicioIDProforma.disparadorDeIDProformas.emit({
      id_proforma:this.agencia_view,
    });

   this.close();
  }

  getDescripcionView(element){
    this.agencia_view = element;
    console.log(this.agencia_view);
  }

  close(){
    this.dialogRef.close();
  }
}
