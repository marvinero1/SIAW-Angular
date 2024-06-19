import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';

// import { ButtonModule } from 'primeng/button';

export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}
@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.scss']
})

export class LaboratorioComponent implements OnInit {
  products!: Product[];
  selectedProducts!: Product;

  metaKey: boolean = true;

  public rowData: any[] | null = [
    {
      coditem: "01VVAM34",
      descripcion: "VAR ROS UNC",
      medida: "3/16-24",
      udm: "PZ",
      porceniva: 0,
      empaque: null,
      cantidad_pedida: 1,
      cantidad: 1,
      porcen_mercaderia: 0,
      codtarifa: 1,
      coddescuento: 0,
      preciolista: 3.15378,
      niveldesc: "X",
      porcendesc: 0,
      preciodesc: 3.15378,
      precioneto: 3.15378,
      total: 3.15378,
      cumple: true,
      cumpleMin: true,
      cumpleEmp: true,
      nroitem: 0,
      porcentaje: 0,
      monto_descto: 0,
      subtotal_descto_extra: 0,
      orden: 1
    },
    {
      coditem: "01VVAM35",
      descripcion: "VAR ROS UNC",
      medida: "1/4-20",
      udm: "PZ",
      porceniva: 0,
      empaque: null,
      cantidad_pedida: 1,
      cantidad: 1,
      porcen_mercaderia: 0.06,
      codtarifa: 1,
      coddescuento: 0,
      preciolista: 3.55823,
      niveldesc: "X",
      porcendesc: 0,
      preciodesc: 3.55823,
      precioneto: 3.55823,
      total: 3.55823,
      cumple: true,
      cumpleMin: true,
      cumpleEmp: true,
      nroitem: 0,
      porcentaje: 0,
      monto_descto: 0,
      subtotal_descto_extra: 0,
      orden: 2
    },
    {
      "coditem": "01VVAM36",
      "descripcion": "VAR ROS UNC",
      "medida": "5/16-18",
      "udm": "PZ",
      "porceniva": 0,
      "empaque": null,
      "cantidad_pedida": 1,
      "cantidad": 1,
      "porcen_mercaderia": 0.07,
      "codtarifa": 1,
      "coddescuento": 0,
      "preciolista": 5.61999,
      "niveldesc": "X",
      "porcendesc": 0,
      "preciodesc": 5.61999,
      "precioneto": 5.61999,
      "total": 5.61999,
      "cumple": true,
      "cumpleMin": true,
      "cumpleEmp": true,
      "nroitem": 0,
      "porcentaje": 0,
      "monto_descto": 0,
      "subtotal_descto_extra": 0,
      "orden": 3
    },
    {
      "coditem": "01VVAM37",
      "descripcion": "VAR ROS UNC",
      "medida": "3/8-16",
      "udm": "PZ",
      "porceniva": 0,
      "empaque": null,
      "cantidad_pedida": 1,
      "cantidad": 1,
      "porcen_mercaderia": 0.06,
      "codtarifa": 1,
      "coddescuento": 0,
      "preciolista": 8.32715,
      "niveldesc": "X",
      "porcendesc": 0,
      "preciodesc": 8.32715,
      "precioneto": 8.32715,
      "total": 8.32715,
      "cumple": true,
      "cumpleMin": true,
      "cumpleEmp": true,
      "nroitem": 0,
      "porcentaje": 0,
      "monto_descto": 0,
      "subtotal_descto_extra": 0,
      "orden": 4
    },
    {
      "coditem": "01VVAM38",
      "descripcion": "VAR ROS UNC",
      "medida": "7/16-14",
      "udm": "PZ",
      "porceniva": 0,
      "empaque": null,
      "cantidad_pedida": 1,
      "cantidad": 1,
      "porcen_mercaderia": 0,
      "codtarifa": 1,
      "coddescuento": 0,
      "preciolista": 11.62355,
      "niveldesc": "X",
      "porcendesc": 0,
      "preciodesc": 11.62355,
      "precioneto": 11.62355,
      "total": 11.62355,
      "cumple": true,
      "cumpleMin": true,
      "cumpleEmp": true,
      "nroitem": 0,
      "porcentaje": 0,
      "monto_descto": 0,
      "subtotal_descto_extra": 0,
      "orden": 5
    },
    {
      "coditem": "01VVAM40",
      "descripcion": "VAR ROS UNC",
      "medida": "1/2-13",
      "udm": "PZ",
      "porceniva": 0,
      "empaque": null,
      "cantidad_pedida": 1,
      "cantidad": 1,
      "porcen_mercaderia": 0.05,
      "codtarifa": 1,
      "coddescuento": 0,
      "preciolista": 15.17635,
      "niveldesc": "X",
      "porcendesc": 0,
      "preciodesc": 15.17635,
      "precioneto": 15.17635,
      "total": 15.17635,
      "cumple": true,
      "cumpleMin": true,
      "cumpleEmp": true,
      "nroitem": 0,
      "porcentaje": 0,
      "monto_descto": 0,
      "subtotal_descto_extra": 0,
      "orden": 6
    },
    {
      "coditem": "01VVAM42",
      "descripcion": "VAR ROS UNC",
      "medida": "5/8-11",
      "udm": "PZ",
      "porceniva": 0,
      "empaque": null,
      "cantidad_pedida": 1,
      "cantidad": 1,
      "porcen_mercaderia": 0.44,
      "codtarifa": 1,
      "coddescuento": 0,
      "preciolista": 25.20787,
      "niveldesc": "X",
      "porcendesc": 0,
      "preciodesc": 25.20787,
      "precioneto": 25.20787,
      "total": 25.20787,
      "cumple": true,
      "cumpleMin": true,
      "cumpleEmp": true,
      "nroitem": 0,
      "porcentaje": 0,
      "monto_descto": 0,
      "subtotal_descto_extra": 0,
      "orden": 7
    },
    {
      "coditem": "01VVAM43",
      "descripcion": "VAR ROS UNC",
      "medida": "3/4-10",
      "udm": "PZ",
      "porceniva": 0,
      "empaque": null,
      "cantidad_pedida": 1,
      "cantidad": 1,
      "porcen_mercaderia": 0,
      "codtarifa": 1,
      "coddescuento": 0,
      "preciolista": 37.2367,
      "niveldesc": "X",
      "porcendesc": 0,
      "preciodesc": 37.2367,
      "precioneto": 37.2367,
      "total": 37.2367,
      "cumple": true,
      "cumpleMin": true,
      "cumpleEmp": true,
      "nroitem": 0,
      "porcentaje": 0,
      "monto_descto": 0,
      "subtotal_descto_extra": 0,
      "orden": 8
    }
  ]

  constructor(private api: ApiService, public dialog: MatDialog) {
    // this.getHojaPorDefecto();

  }

  ngOnInit(): void {

  }

  itemDataAll() {
    console.log("HOLA LOLA");
  }


  openDialogMatriz() {
    this.dialog.open(ModalVendedorComponent, {
      //height: "auto",
      // width: "calc(100% - 100px)",
      // maxWidth: "100%",
      //  maxHeight: "100%",
    });
  }
}