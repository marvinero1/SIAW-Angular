import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-proforma-pdf-email',
  templateUrl: './proforma-pdf-email.component.html',
  styleUrls: ['./proforma-pdf-email.component.css']
})
export class ProformaPdfEmailComponent implements OnInit, AfterViewInit {

  codigo_get_proforma: any;
  ventana: string = "proformaPDF";
  private debounceTimer: any;

  public data_impresion: any = [];

  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;

  data_cabecera_footer_proforma: any = [];
  data_detalle_proforma: any = [];

  constructor(public nombre_ventana_service: NombreVentanaService, private api: ApiService, private toastr: ToastrService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.data_impresion = sessionStorage.getItem("data_impresion") !== undefined ? JSON.parse(sessionStorage.getItem("data_impresion")) : null;

    console.log("data impresion: ", this.data_impresion);

    //primero carga la info del PDF, y el PDF se tiene q pintar de data
    this.getDataPDF();
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      // una vez q la data se cargue al PDF, el PDF se genera y se envia el archivo PDF ya generado con la data en el xD xD
      this.generatePDF()
    }, 4000);
  }

  getDataPDF() {
    let array_send={
      codProforma: this.data_impresion[0].codigo_proforma,
      codcliente: this.data_impresion[0].cod_cliente ,
      codcliente_real: this.data_impresion[0].cod_cliente_real,
      codempresa: this.BD_storage,
      cmbestado_contra_entrega: this.data_impresion[0].cmbestado_contra_entrega.toString(),
      paraAprobar: this.data_impresion[0].grabar_aprobar
    };

    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDataPDF/";
    return this.api.create('/venta/transac/veproforma/getDataPDF/' + this.userConn, array_send)
      .subscribe({
        next: (datav) => {
          console.log("DATA DEL PDF: ", datav);
          //datav.docveprofCab CABECERA Y FOOTER
          this.data_cabecera_footer_proforma = datav.docveprofCab;
          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.dtveproforma1;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDataPDFHarcode() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDataPDF/";
    return this.api.getAll('/venta/transac/veproforma/getDataPDF/' + this.userConn + "/120028/801406/801406/PE/PORCANCELAR")
      .subscribe({
        next: (datav) => {
          console.log("DATA DEL PDF: ", datav);
          //datav.docveprofCab CABECERA Y FOOTER
          this.data_cabecera_footer_proforma = datav.docveprofCab

          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.dtveproforma1;
          console.log("tamanio data: ", [datav].length);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          //this.printFunction();
        }
      })
  }

  printFunction() {
    this.generatePDF();
  }

  generatePDF() {
    const content = document.getElementById('content');
    if (content) {
      html2canvas(content, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.75); // Cambiado a JPEG con calidad 0.75

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'letter' // Formato Carta (Letter)
        });

        const margin = 10;
        const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;

        pdf.addImage(imgData, 'JPEG', margin, margin, newWidth, newHeight);

        const pdfBlob = pdf.output('blob');
        console.log("ARCHIVO pdf a enviar correo: ", pdfBlob);

        // Guardar el PDF localmente para ver si se genera correctamente
        //pdf.save(this.data_cabecera_footer_proforma.titulo + "-" + this.data_cabecera_footer_proforma.rnombre_comercial + '.pdf');

        // Enviar el correo cuando ya está generado el PDF
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          // una vez q la data se cargue al PDF, el PDF se genera y se envia el archivo PDF ya generado con la data en el xD xD
          this.enviarCorreoProformaGuardada(pdfBlob);
        }, 4000);

      });
    }
  }

  // fin enviador de correo al finalizar de grabar la proforma
  enviarCorreoProformaGuardada(pdfBlob: Blob) {
    const formData = new FormData();
    formData.append('pdfFile', pdfBlob, this.data_cabecera_footer_proforma.titulo + "-" + this.data_cabecera_footer_proforma.rnombre_comercial + '.pdf');

    console.log(formData.get('pdfFile'));
    console.log(formData);

    const errormesagge = "La Ruta presenta fallos al hacer petición POST -/notif/envioCorreos/envioCorreoProforma/ ";
    this.api.createAllWithOutToken(`/notif/envioCorreos/envioCorreoProforma/${this.userConn}/${this.usuarioLogueado}/${this.data_impresion[0].codigo_vendedor}/${this.data_impresion[0].codigo_proforma}`, formData).subscribe({
      next: (datav) => {
        console.log(datav);
        this.toastr.success("CORREO ELECTRONICO ENVIADO ! 📧");
      },
      error: (err: any) => {
        console.log(err, errormesagge);
        console.log(pdfBlob);
      },
      complete: () => {
        // window.close();
      }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(formattedNumber);
  }

  formatNumberTotalSub2Decimals(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formattedNumber);
  }

  refrsh() {
    window.location.reload();
  }
}
