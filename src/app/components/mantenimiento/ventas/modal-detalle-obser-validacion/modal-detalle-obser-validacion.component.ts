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
  more_messagess: any = [];
  lines: any;

  data_string: string;
  obs_contenido_get_string: string;
  more_messagess_string: string;

  constructor(public dialogRef: MatDialogRef<ModalDetalleObserValidacionComponent>,
    @Inject(MAT_DIALOG_DATA) public obs_titulo: any,
    @Inject(MAT_DIALOG_DATA) public obs_contenido: any,
    @Inject(MAT_DIALOG_DATA) public more_messages: any) {

    // this.data = this.processMessage(obs_titulo.obs_titulo);
    // this.data = obs_titulo.obs_titulo;
    // this.obs_contenido_get = obs_contenido.obs_contenido;
    // this.more_messagess = more_messages.more_messages;

    this.data_string = obs_titulo.obs_titulo;
    // this.obs_contenido_get_string = obs_contenido.obs_contenido.replace(/-/g, '');
    this.obs_contenido_get_string = obs_contenido.obs_contenido;

    this.more_messagess_string = more_messages.more_messages;

    // console.log("mensaje no procesado: ", obs_titulo.obs_titulo);
    // console.log("mensaje procesado, data: ", this.data);
    // console.log("contenido: ?", this.obs_contenido_get);
    // console.log("mas mensajes?: ", this.more_messagess);

    console.log("mensaje no procesado: ", obs_titulo.obs_titulo);
    console.log("mensaje procesado, data: ", this.data_string);
    // console.log("contenido: ?", this.obs_contenido_get_string.replace(/-/g, ''));
    console.log("contenido: ?", this.obs_contenido_get_string);

    console.log("mas mensajes?: ", this.more_messagess_string)
  }

  ngOnInit() {
    // Procesar el mensaje para crear la estructura de datos
    // this.data = this.processMessage(this.message);

    this.data = this.message;
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
          return `<tr><td> ${index} </td><td> ${element} </td></tr>`;
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
