import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ServicioclienteService } from '@components/mantenimiento/ventas/serviciocliente/serviciocliente.service';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { ApiService } from '@services/api.service';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { LogService } from '@services/log-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { SaldoItemMatrizService } from '@components/mantenimiento/ventas/matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';

@Component({
  selector: 'app-notamovimiento',
  templateUrl: './notamovimiento.component.html',
  styleUrls: ['./notamovimiento.component.scss']
})

export class NotamovimientoComponent implements OnInit {

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
      private servicioCliente: ServicioclienteService, private almacenservice: ServicioalmacenService, private cdr: ChangeDetectorRef,
      private serviciovendedor: VendedorService, private datePipe: DatePipe, private _formBuilder: FormBuilder, private saldoItemServices: SaldoItemMatrizService,
      private messageService: MessageService, private spinner: NgxSpinnerService, private log_module: LogService, 
      private _snackBar: MatSnackBar,  public nombre_ventana_service: NombreVentanaService, private router: Router) { 

      }

  ngOnInit() {
    
  }

  alMenu(){
    const dialogRefLimpiara = this.dialog.open(DialogConfirmActualizarComponent, {
      width: 'auto',
      height: 'auto',
      data: { mensaje_dialog: "¿ ESTA SEGUR@ DE SALIR AL MENU PRINCIPAL ?" },
      disableClose: true,
    });


    dialogRefLimpiara.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.router.navigateByUrl('');
      }
    });
  }
}
