import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ConsolidacionInventario } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceRefreshItemsService } from '../services-refresh-item/service-refresh-items.service';

@Component({
  selector: 'app-consolidar-inventario',
  templateUrl: './consolidar-inventario.component.html',
  styleUrls: ['./consolidar-inventario.component.scss']
})
export class ConsolidarInventarioComponent implements OnInit {

  data: any;
  dataConsolidar: any = [];
  postConsolidar: any = [];
  userConn: any;
  allSelected: boolean = false;
  data_cabezera: any = [];
  data_items: any = [];
  cabecera: any = [];
  items: any = [];

  nombre_ventana: string = "prgconsolinv.vb";

  displayedColumns = ['consolidado', 'codigo', 'grupo', 'observaciones'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();
  selection = new SelectionModel<ConsolidacionInventario>(true, []);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  public ventana = "consolidar-inventario"
  public detalle = "consolidar-inventario-REFRESH";
  public tipo = "consolidar-inventario-REFRESH";

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ConsolidarInventarioComponent>,
    private api: ApiService, @Inject(MAT_DIALOG_DATA) public dataInventario: any,
    @Inject(MAT_DIALOG_DATA) public items_consolidar: any, private refreshItemSer: ServiceRefreshItemsService,
    public log_module: LogService,
    private toastr: ToastrService, private spinner: NgxSpinnerService) {

    this.data_cabezera = this.dataInventario.dataInventario;
    this.data_items = this.items_consolidar.items_consolidar

    console.log(this.data_cabezera, this.data_items);


    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    this.getData();
    this.cargarCabecera()
  }

  getData() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET /inventario/oper/prgconsolinv/";
    return this.api.getAll('/inventario/oper/prgconsolinv/' + this.userConn + "/" + this.data_cabezera.codigo)
      .subscribe({
        next: (datav) => {
          this.data = datav;
          console.log(this.data);

          // this.dataSource = new MatTableDataSource<ConsolidacionInventario>(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! ERROR CABECERA !');
        },
        complete: () => { }
      })
  }

  cargarCabecera() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/oper/docininvconsol/cargarCabecera/' + this.userConn + "/" + this.data_cabezera.id + "/" + this.data_cabezera.numeroid)
      .subscribe({
        next: (datav) => {
          this.cabecera = datav;
          console.log(this.cabecera);

          this.cargarTablaItems(this.cabecera.codigo)
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! ERROR CABECERA !');

        },
        complete: () => { }
      })
  }

  cargarTablaItems(codigo) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/oper/docininvconsol/mostrardetalle/' + this.userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.items = datav;
          console.log(this.items);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  consolidar() {
    console.log(this.data);

    let data_save: any = {
      "data_consolinv": this.data,

      "detalleInvConsol": this.items,
    };

    console.log(data_save);

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /inventario/oper/prgconsolinv/";
    return this.api.create('/inventario/oper/prgconsolinv/' + this.userConn + "/" + this.data_cabezera.codigo, data_save)
      .subscribe({
        next: (datav) => {
          this.postConsolidar = datav;
          this.toastr.success('!GUARDADO EXITOSAMENTE!');
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.close();

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');

        },
        complete: () => { }
      })
  }

  checkUncheckAll() {
    const tama = this.data.length;

    for (let i = 0; i < tama; i++) {
        this.data[i].consolidado = this.allSelected;
    }

    // Mapeo que cambia un valor de un array
    this.data = this.data.map((dato) => {
        console.log(dato);

        // Usa '===' para comparación
        if (dato.consolidado === "true") {
            dato.consolidado = "false";
        } else {
            dato.consolidado = "true";
        }

        return dato; // Devuelve el dato actualizado
    });

    // Actualiza la dataSource una vez después de completar el mapeo
    // this.dataSource = new MatTableDataSource<ConsolidacionInventario>(this.data);
    this.dataSource.paginator = this.paginatorPageSize; // Asegúrate de que esto sea el paginator correcto
}


  isAllSelected(data) {
    console.log(data);

    this.allSelected = this.data.every(function (item: any) {
      return item.consolidado == true;
    });
  }


  toggleAllSelection() {
    console.log("SELECT ALL");
    // if (this.allSelected) {
    //   this.select.options.forEach((item: MatOption) => item.select());
    // } else {
    //   this.select.options.forEach((item: MatOption) => item.deselect());
    // }
  }

  close() {
    this.dialogRef.close();
    this.refreshItemSer.callItemFunction();
  }
}
