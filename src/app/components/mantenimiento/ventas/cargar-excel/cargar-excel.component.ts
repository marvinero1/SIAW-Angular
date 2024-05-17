import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { ItemServiceService } from '../serviciosItem/item-service.service';


@Component({
  selector: 'app-cargar-excel',
  templateUrl: './cargar-excel.component.html',
  styleUrls: ['./cargar-excel.component.scss']
})
export class CargarExcelComponent implements OnInit {

  jsonData: any;
  selectedFile: File | null = null;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  constructor(public dialogRef: MatDialogRef<CargarExcelComponent>, public itemservice: ItemServiceService) { }

  ngOnInit() {

  }

  uploadExcel() {
    if (this.selectedFile) {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        workbook.SheetNames.forEach(sheet => {
          const rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
          this.jsonData = rowObject;
          console.log(this.jsonData);

          //servicio que envia el detalle a proforma para q se pinte en su tabla
          this.itemservice.disparadorDeDetalleImportarExcel.emit({
            detalle: this.jsonData,
          });
        });
      };
      fileReader.readAsBinaryString(this.selectedFile);
      this.close();
    }

  }

  close() {
    this.dialogRef.close();
  }
}
