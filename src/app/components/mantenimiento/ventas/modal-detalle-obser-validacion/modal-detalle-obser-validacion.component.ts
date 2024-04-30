import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detalle-obser-validacion',
  templateUrl: './modal-detalle-obser-validacion.component.html',
  styleUrls: ['./modal-detalle-obser-validacion.component.scss']
})
export class ModalDetalleObserValidacionComponent implements OnInit {

  data: any = [];
  message: string;
  titulo: any = [];
  obs_contenido_get: any = [];
  lines: any;

  constructor(public dialogRef: MatDialogRef<ModalDetalleObserValidacionComponent>,
    @Inject(MAT_DIALOG_DATA) public obs_titulo: any,
    @Inject(MAT_DIALOG_DATA) public obs_contenido: any,) {

    this.data = this.processMessage(obs_titulo.obs_titulo);
    this.obs_contenido_get = obs_contenido.obs_contenido;

    console.log(this.message);
    console.log(this.obs_contenido_get);
  }

  ngOnInit() {
    this.message = `
      DESCUENTO PENDIENTE POR DEPOSITO DE CLIENTE                                    
      -----------------------------------------------------------------------------------
      COD     DOC            FECHA       DOC            MONTO     MONTO     %     MON
      CLIENT  CBZA           DEPOSITO    DEPOSITO       DEPOSITO  DIST      DESC  DES
      -----------------------------------------------------------------------------------

      304067  CB301 31877     28/4/2023   DP311 26847    5363,11   160,89    100   160,8
      -----------------------------------------------------------------------------------
      Total Descuento Por Depositos Aplicable: 160,89 US
      Total Descuento Por Depositos Aplicado: 1119,79 BS
      -----------------------------------------------------------------------------------
      El Descuento aplicado incluye Reintegro Depositos Pendientes Por: 160,89 US
      Nota.-El monto restante del deposito queda pendiente para la siguiente proforma.
    `;

    // Procesar el mensaje para crear la estructura de datos
    this.data = this.processMessage(this.message);
  }


  processMessage(message: string): any[] {
    this.lines = message.split('\n').filter(line => line.trim() !== '');
    const dataIndex = this.lines.findIndex(line => line.includes('COD') && line.includes('DOC')
      && line.includes('FECHA') && line.includes('DOC') && line.includes('MONTO') &&
      line.includes('MONTO') && line.includes('%') && line.includes('MON'));

    if (dataIndex !== -1 && dataIndex + 1 < this.lines.length) {
      const dataSection = this.lines.slice(dataIndex + 1);
      const dataLines = dataSection.filter(line => !line.includes('---') && line.trim() !== '');

      if (dataLines.length > 1) {
        const headers = dataLines[0].split(/\s+/);
        const rowData = {};
        const values = dataLines[1].split(/\s+/);

        for (let i = 0; i < headers.length; i++) {
          rowData[headers[i]] = values[i];
        }

        console.log(this.lines);
        const tableRows = this.lines.map((element, index) => {
          return `<tr><td>${index}</td><td>${element}</td></tr>`;
        });

        const tableHTML = `<table>${tableRows.join('')}</table>`;

        console.log(tableHTML);

        return [rowData];
      }
    }

    return [];
  }



  close() {
    this.dialogRef.close();
  }
}
