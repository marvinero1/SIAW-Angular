import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-solicitar-urgente',
  templateUrl: './modal-solicitar-urgente.component.html',
  styleUrls: ['./modal-solicitar-urgente.component.scss']
})
export class ModalSolicitarUrgenteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalSolicitarUrgenteComponent>, private toastr: ToastrService,
    private api: ApiService, public _snackBar: MatSnackBar, private datePipe: DatePipe) {

  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
