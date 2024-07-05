import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { inAlmacen } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ServicioalmacenService } from '../servicioalmacen/servicioalmacen.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-modal-almacen',
  templateUrl: './modal-almacen.component.html',
  styleUrls: ['./modal-almacen.component.scss']
})
export class ModalAlmacenComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarAlmacen();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarAlmacen();
  };

  public agencia_view: any = [];


  agencia_get: any = [];
  origen_get: string;
  destino_get: string;
  almacen_get: string;
  userConn: any;

  almacenes!: inAlmacen[];
  selectealmacenes: inAlmacen[];
  searchValue: string | undefined;

  options: inAlmacen[] = [];
  filteredOptions: Observable<inAlmacen[]>;
  myControlCodigo = new FormControl<string | inAlmacen>('');
  myControlDescripcion = new FormControl<string | inAlmacen>('');

  @ViewChild('dt1') dt1: Table;
  @ViewChild('tbb') dt11: Table;

  constructor(private api: ApiService, public dialogRef: MatDialogRef<ModalAlmacenComponent>,
    private servicioAlmacen: ServicioalmacenService, @Inject(MAT_DIALOG_DATA) public origen: any,
    @Inject(MAT_DIALOG_DATA) public destino: any, @Inject(MAT_DIALOG_DATA) public almacen: any) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    this.getAlmacen();

    this.origen_get = this.origen.origen;
    this.destino_get = this.destino.destino;
    this.almacen_get = this.almacen.almacen;

    console.log(this.origen_get, this.destino_get);
  }

  getAlmacen() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo2/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo2/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.agencia_get = datav;
          this.almacenes = datav;
          console.log(this.agencia_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarAlmacen() {
    if (this.origen_get) {
      this.servicioAlmacen.disparadorDeAlmacenesOrigen.emit({
        almacen: this.agencia_view,
      });
    } if (this.destino_get) {
      this.servicioAlmacen.disparadorDeAlmacenesDestino.emit({
        almacen: this.agencia_view,
      });
    } if (this.almacen_get) {
      this.servicioAlmacen.disparadorDeAlmacenes.emit({
        almacen: this.agencia_view,
      });
    }

    this.close();
  }

  private debounceTimer: any;
  onSearchChange(searchValue: string) {
    console.log(searchValue);
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.dt1.filterGlobal(searchValue, 'contains');
    }, 750); // 750 ms de retardo

    let tableElement = this.dt11.el.nativeElement;
    tableElement.focus();
  }

  getDescripcionView(element) {
    this.agencia_view = element.data;
    console.log(this.agencia_view);
  }

  close() {
    this.dialogRef.close();
  }
}
