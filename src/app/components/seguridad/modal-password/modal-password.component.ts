import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { Autorizacion } from '@services/modelos/objetos';
import { ModalGenerarAutorizacionComponent } from '@components/seguridad/modal-generar-autorizacion/modal-generar-autorizacion.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';

@Component({
  selector: 'app-modal-password',
  templateUrl: './modal-password.component.html',
  styleUrls: ['./modal-password.component.scss']
})
export class ModalPasswordComponent implements OnInit {

  //VENTANA AZUL DE PASSWORD

  autorizacion: Autorizacion[] = [
    { codigo: "01", descripcion: "MODIFICACION DE PLAN DE PAGOS", codigo_descripcion: "01 - MODIFICACION DE PLAN DE PAGOS" },
    { codigo: "02", descripcion: "DISTRIBUCION MANUAL DE COBRANZAS", codigo_descripcion: "02 - DISTRIBUCION MANUAL DE COBRANZAS" },
    { codigo: "03", descripcion: "NOTA DE REMISION QUE NO CUMPLA", codigo_descripcion: "03 - NOTA DE REMISION QUE NO CUMPLA" },
    { codigo: "04", descripcion: "PROFORMAS COMPLEMENTARIAS", codigo_descripcion: "04 - PROFORMAS COMPLEMENTARIAS" },
    { codigo: "05", descripcion: "APROBAR COBRANZAS DIRECTAMENTE", codigo_descripcion: "05 - APROBAR COBRANZAS DIRECTAMENTE" },
    { codigo: "06", descripcion: "APROBAR PROFORMAS DIRECTAMENTE ", codigo_descripcion: "06 - APROBAR PROFORMAS DIRECTAMENTE" },
    { codigo: "07", descripcion: "APROBAR COMPROBANTES DIRECTAMENTE", codigo_descripcion: "07 - APROBAR COMPROBANTES DIRECTAMENTE" },
    { codigo: "08", descripcion: "MODIFICAR PLANILLA DE HABERES", codigo_descripcion: "08 - MODIFICAR PLANILLA DE HABERES", },
    { codigo: "09", descripcion: "MODIFICAR PLANILLA DE COMISIONES ", codigo_descripcion: "09 - MODIFICAR PLANILLA DE COMISIONES" },
    { codigo: "10", descripcion: "MODIFICAR PLANILLA DE AGUINALDOS", codigo_descripcion: "10 - MODIFICAR PLANILLA DE AGUINALDOS" },
    { codigo: "11", descripcion: "ACEPTAR FACTURA", codigo_descripcion: "11 - ACEPTAR FACTURA", },
    { codigo: "12", descripcion: "MODIFICAR PLANILLA DE PRIMAS ", codigo_descripcion: "12 - MODIFICAR PLANILLA DE PRIMAS " },
    { codigo: "13", descripcion: "MODIFICAR MANUALMENTE NOTA DE MOVIMIENTO ORIGEN ", codigo_descripcion: "13 - MODIFICAR MANUALMENTE NOTA DE MOVIMIENTO ORIGEN" },
    { codigo: "14", descripcion: "CREAR CLIENTE CON NIT REPETIDO", codigo_descripcion: "14 - CREAR CLIENTE CON NIT REPETIDO" },
    { codigo: "15", descripcion: "DESHABILITAR NIT ANTES DE DIAS MINIMOS", codigo_descripcion: "15 - DESHABILITAR NIT ANTES DE DIAS MINIMOS" },
    { codigo: "16", descripcion: "HABILITAR CONSOLIDAR PRECIOS EMBARQUES ", codigo_descripcion: "16 - HABILITAR CONSOLIDAR PRECIOS EMBARQUES" },
    { codigo: "17", descripcion: "RE - ABRIR INVENTARIO FISICO CERRADO", codigo_descripcion: "17 - RE - ABRIR INVENTARIO FISICO CERRADO" },
    { codigo: "18", descripcion: "GRABAR VISITAS FUERA DE FECHA", codigo_descripcion: "18 - GRABAR VISITAS FUERA DE FECHA" },
    { codigo: "19", descripcion: "ACEPTAR NOTAS DE CREDITO DE DESCUENTO FUERA DE PLAZO", codigo_descripcion: "19 - ACEPTAR NOTAS DE CREDITO DE DESCUENTO FUERA DE PLAZO" },
    { codigo: "20", descripcion: "ACEPTAR PROFORMAS QUE PASAN EL MAXIMO % DE VENTA PERMITIDO", codigo_descripcion: "20 - ACEPTAR PROFORMAS QUE PASAN EL MAXIMO % DE VENTA PERMITIDO" },
    { codigo: "21", descripcion: "ACEPTAR MAS DE UNA NOTA DE CREDITO DE DESCUENTO", codigo_descripcion: "21 - ACEPTAR MAS DE UNA NOTA DE CREDITO DE DESCUENTO" },
    { codigo: "22", descripcion: "DESCUENTO CON PORCENTAJE MAYOR AL PERMITIDO", codigo_descripcion: "22 - DESCUENTO CON PORCENTAJE MAYOR AL PERMITIDO", },
    { codigo: "23", descripcion: "ACEPTAR SOL.URGENTE AUNQUE LA AGENCIA PUEDA CUBRIR", codigo_descripcion: "23 - ACEPTAR SOL.URGENTE AUNQUE LA AGENCIA PUEDA CUBRIR" },
    { codigo: "24", descripcion: "ACEPTAR NOTAS DE CREDITO DE DESCUENTO SIN LIMITE", codigo_descripcion: "24 - ACEPTAR NOTAS DE CREDITO DE DESCUENTO SIN LIMITE" },
    { codigo: "25", descripcion: "ACEPTAR VENTA SIN EMPAQUES CERRADOS", codigo_descripcion: "25 - ACEPTAR VENTA SIN EMPAQUES CERRADOS" },
    { codigo: "26", descripcion: "ACEPTAR COBRANZA CON FECHA DE RECIBO NO CORRELATIVA", codigo_descripcion: "26 - ACEPTAR COBRANZA CON FECHA DE RECIBO NO CORRELATIVA" },
    { codigo: "27", descripcion: "APROBAR PROFORMAS SOLO GRABADAS", codigo_descripcion: "27 - APROBAR PROFORMAS SOLO GRABADAS" },
    { codigo: "28", descripcion: "REIMPRESION DE FACTURA", codigo_descripcion: "28 - REIMPRESION DE FACTURA", },
    { codigo: "29", descripcion: "FACTURAR NOTA DE REMISION DE FECHA PASADA", codigo_descripcion: "29 - FACTURAR NOTA DE REMISION DE FECHA PASADA" },
    { codigo: "30", descripcion: "MODIFICACION POST CIERRE DIARIO", codigo_descripcion: "30 - MODIFICACION POST CIERRE DIARIO", },
    { codigo: "31", descripcion: "VENTAS MAYORES AL MONTO MINIMO DE RND 10001111 ", codigo_descripcion: "31 - VENTAS MAYORES AL MONTO MINIMO DE RND 10001111" },
    { codigo: "32", descripcion: "REIMPRESION DE PROFORMA", codigo_descripcion: "32 - REIMPRESION DE PROFORMA" },
    { codigo: "33", descripcion: "FACTURAR NOTA DE REMISION NO REG EN DESPACHOS", codigo_descripcion: "33 - FACTURAR NOTA DE REMISION NO REG EN DESPACHOS", },
    { codigo: "34", descripcion: "SALIR DEL SISTEMA CON NOTAS DE REMISION PENDIENTES", codigo_descripcion: "34 - SALIR DEL SISTEMA CON NOTAS DE REMISION PENDIENTES" },
    { codigo: "35", descripcion: "PERMITIR ITEMS REPETIDOS", codigo_descripcion: "35 - PERMITIR ITEMS REPETIDOS" },
    { codigo: "36", descripcion: "VENTA MAYOR AL MAXIMO DE VENTA", codigo_descripcion: "36 - VENTA MAYOR AL MAXIMO DE VENTA" },
    { codigo: "37", descripcion: "PERMITIR EXTENSION PP MAYOR A 3 DIAS DEL VENCIMIENTO", codigo_descripcion: "37 - PERMITIR EXTENSION PP MAYOR A 3 DIAS DEL VENCIMIENTO" },
    { codigo: "38", descripcion: "PERMITIR ASIGNAR EXTENSION HASTA 3 DIAS DEL VENCIMIENTO", codigo_descripcion: "38 - PERMITIR ASIGNAR EXTENSION HASTA 3 DIAS DEL VENCIMIENTO" },
    { codigo: "39", descripcion: "MARCAR FACTURA COMO CONTRA - ENTREGA", codigo_descripcion: "39 - MARCAR FACTURA COMO CONTRA - ENTREGA" },
    { codigo: "40", descripcion: "CREAR CLIENTE CON MONEDA DE VENTA MN", codigo_descripcion: "40 - CREAR CLIENTE CON MONEDA DE VENTA MN" },
    { codigo: "41", descripcion: "MODIFICAR ETIQUETA DE PROFORMA", codigo_descripcion: "41 - MODIFICAR ETIQUETA DE PROFORMA" },
    { codigo: "42", descripcion: "PERMITIR VENTA CON DESCUENTOS MEZCLADOS", codigo_descripcion: "42 - PERMITIR VENTA CON DESCUENTOS MEZCLADOS" },
    { codigo: "43", descripcion: "MODIFICAR EL VENDEDOR ASIGNADO A UN CLIENTE", codigo_descripcion: "43 - MODIFICAR EL VENDEDOR ASIGNADO A UN CLIENTE" },
    { codigo: "44", descripcion: "MODIFICAR EL NUMERO DE RECIBO DE UNA COBRANZA", codigo_descripcion: "44 - MODIFICAR EL NUMERO DE RECIBO DE UNA COBRANZA" },
    { codigo: "45", descripcion: "PERMITIR PORCENTAJE MAYOR A 100 EN CARGOS", codigo_descripcion: "45 - PERMITIR PORCENTAJE MAYOR A 100 EN CARGOS" },
    { codigo: "46", descripcion: "DESCUENTO POR LINEA RESTRINGIDO", codigo_descripcion: "46 - DESCUENTO POR LINEA RESTRINGIDO" },
    { codigo: "47", descripcion: "CAMBIO DE CREDITO RESTRINGIDO", codigo_descripcion: "47 - CAMBIO DE CREDITO RESTRINGIDO" },
    { codigo: "48", descripcion: "MODIFICACION ANTERIOR A INVENTARIO", codigo_descripcion: "48 - MODIFICACION ANTERIOR A INVENTARIO" },
    { codigo: "49", descripcion: "EDITAR UNA COBRANZA ACTUAL", codigo_descripcion: "49 - EDITAR UNA COBRANZA ACTUAL" },
    { codigo: "50", descripcion: "EDITAR UNA COBRANZA PASADA ", codigo_descripcion: "50 - EDITAR UNA COBRANZA PASADA" },
    { codigo: "51", descripcion: "GRABAR PROFORMA SIN CUMPLIR EMPAQUE MINIMO", codigo_descripcion: "51 - GRABAR PROFORMA SIN CUMPLIR EMPAQUE MINIMO" },
    { codigo: "52", descripcion: "GRABAR PROFORMA SIN CUMPLIR EMPAQUE CERRADO", codigo_descripcion: "52 - GRABAR PROFORMA SIN CUMPLIR EMPAQUE CERRADO" },
    { codigo: "53", descripcion: "VER RUTAS EN EL LISTADO DE CLIENTES", codigo_descripcion: "53 - VER RUTAS EN EL LISTADO DE CLIENTES" },
    { codigo: "54", descripcion: "GRABAR MODIFICACIONES EN LIBRO DE COMPRAS", codigo_descripcion: "54 - GRABAR MODIFICACIONES EN LIBRO DE COMPRAS" },
    { codigo: "55", descripcion: "MODIFICACIONCOMPROBANTE", codigo_descripcion: "55 - MODIFICACIONCOMPROBANTE" },
    { codigo: "56", descripcion: "MODIFICACION NOTA DE MOVIMIENTO", codigo_descripcion: "56 - MODIFICACION NOTA DE MOVIMIENTO" },
    { codigo: "57", descripcion: "MODIFICACION PROFORMA", codigo_descripcion: "57 - MODIFICACION PROFORMA" },
    { codigo: "58", descripcion: "MODIFICACION NOTA DE REMISION", codigo_descripcion: "58 - MODIFICACION NOTA DE REMISION" },
    { codigo: "59", descripcion: "MODIFICACION COBRANZA", codigo_descripcion: "59 - MODIFICACION COBRANZA" },
    { codigo: "60", descripcion: "MODIFICACION ANTICIPO", codigo_descripcion: "60 - MODIFICACION ANTICIPO" },
    { codigo: "61", descripcion: "MODIFICACION COMPRA", codigo_descripcion: "61 - MODIFICACION COMPRA" },
    { codigo: "62", descripcion: "VENTA_CON_TIPO_DE_PAGO_NO_HABILITADO_PARA_EL_CLIENTE", codigo_descripcion: "62 - VENTA_CON_TIPO_DE_PAGO_NO_HABILITADO_PARA_EL_CLIENTE" },
    { codigo: "63", descripcion: "VENTA_SIN_TIPO_DE_PRECIO_HABILITADO", codigo_descripcion: "63 - VENTA_SIN_TIPO_DE_PRECIO_HABILITADO" },
    { codigo: "64", descripcion: "VENTA_SIN_CUMPLIR_MONTO_MINIMO_DE_LISTA_DE_PRECIOS", codigo_descripcion: "64 - VENTA_SIN_CUMPLIR_MONTO_MINIMO_DE_LISTA_DE_PRECIOS" },
    { codigo: "65", descripcion: "VENTA_SIN_CUMPLIR_EL_MONTO_MINIMO_DE_LOS_DESCUENTOS_ESPECIALES", codigo_descripcion: "65 - VENTA_SIN_CUMPLIR_EL_MONTO_MINIMO_DE_LOS_DESCUENTOS_ESPECIALES" },
    { codigo: "66", descripcion: "VENTA_SIN_CUMPLIR_LOS_MONTOS_MINIMOS_DE_LOS_DSCTOS_EXTRA", codigo_descripcion: "66 - VENTA_SIN_CUMPLIR_LOS_MONTOS_MINIMOS_DE_LOS_DSCTOS_EXTRA" },
    { codigo: "67", descripcion: "VENTA_CON_CREDITO_INSUFICIENTE", codigo_descripcion: "67 - VENTA_CON_CREDITO_INSUFICIENTE" },
    { codigo: "68", descripcion: "PERMITIR_SOBREPASAR_EL_MAXIMO_DE_VENTAS_URGENTES", codigo_descripcion: "68 - PERMITIR_SOBREPASAR_EL_MAXIMO_DE_VENTAS_URGENTES" },
    { codigo: "69", descripcion: "VENTA_SIN_CUMPLIR_EL_PESO_MINIMO_DE_DESCUENTOS", codigo_descripcion: "69 - VENTA_SIN_CUMPLIR_EL_PESO_MINIMO_DE_DESCUENTOS" },
    { codigo: "70", descripcion: "VENTA_NO_CONTRAENTREGA_A_CLIENTE_CONTRAENTREGA", codigo_descripcion: "70 - VENTA_NO_CONTRAENTREGA_A_CLIENTE_CONTRAENTREGA" },
    { codigo: "71", descripcion: "VENTA_A_CREDITO_A_CLIENTE_SIN_NOMBRE", codigo_descripcion: "71 - VENTA_A_CREDITO_A_CLIENTE_SIN_NOMBRE" },
    { codigo: "72", descripcion: "VENTA_CON_DIRECCION_NO_REGISTRADA", codigo_descripcion: "72 - VENTA_CON_DIRECCION_NO_REGISTRADA" },
    { codigo: "73", descripcion: "VENTA_CON_DSCTOS_NO_PERMITIDOS_PARA_VTA_CONTRAENTREGA", codigo_descripcion: "73 - VENTA_CON_DSCTOS_NO_PERMITIDOS_PARA_VTA_CONTRAENTREGA" },
    { codigo: "74", descripcion: "VENTA_A_COMPETENCIA_CON_DCSTOS_Y_PRECIOS_ESPECIALES", codigo_descripcion: "74 - VENTA_A_COMPETENCIA_CON_DCSTOS_Y_PRECIOS_ESPECIALES" },
    { codigo: "75", descripcion: "MODIFICAR FECHA DE ANULACION", codigo_descripcion: "75 - MODIFICAR FECHA DE ANULACION" },
    { codigo: "76", descripcion: "COBRANZA CON FECHA FUTURA", codigo_descripcion: "76 - COBRANZA CON FECHA FUTURA" },
    { codigo: "77", descripcion: "REGISTRAR DEPOSITOS BANCARIOS", codigo_descripcion: "77 - REGISTRAR DEPOSITOS BANCARIOS" },
    { codigo: "78", descripcion: "ANULAR REVERSION", codigo_descripcion: "78 - ANULAR REVERSION" },
    { codigo: "79", descripcion: "CREACION Y MODIFICACION DE DATOS DE CLIENTES", codigo_descripcion: "79 - CREACION Y MODIFICACION DE DATOS DE CLIENTES" },
    { codigo: "80", descripcion: "DESCUENTO POR LINEA (A EXCEPCIÓN DE LINEAS ESPECIALES)", codigo_descripcion: "80 - DESCUENTO POR LINEA (A EXCEPCIÓN DE LINEAS ESPECIALES)" },
    { codigo: "81", descripcion: "LLEVAR MERCADERÍA A DIRECCIÓN DIFERENTE QUE LA REGISTRATA EN SIA", codigo_descripcion: "81 - LLEVAR MERCADERÍA A DIRECCIÓN DIFERENTE QUE LA REGISTRATA EN SIA" },
    { codigo: "82", descripcion: "CREACIÓN DE PLAN DE PAGOS POR NOTAS REVERTIDAS", codigo_descripcion: "82 - CREACIÓN DE PLAN DE PAGOS POR NOTAS REVERTIDAS", },
    { codigo: "89", descripcion: "ANULACIÓN DE FACTURAS DENTRO DEL MES CUANDO NO SE REALIZO INVENTARIO", codigo_descripcion: "83 - ANULACIÓN DE FACTURAS DENTRO DEL MES CUANDO NO SE REALIZO INVENTARIO", },
    { codigo: "84", descripcion: "ANULACIÓN DE FACTURAS FUERA DEL MES O CUANDO SE REALIZÓ INVENTARIO", codigo_descripcion: "84 - ANULACIÓN DE FACTURAS FUERA DEL MES O CUANDO SE REALIZÓ INVENTARIO", },
    { codigo: "85", descripcion: "CREAR ANTICIPO DE COBRANZA", codigo_descripcion: "85 - CREAR ANTICIPO DE COBRANZA", },
    { codigo: "86", descripcion: "ELIMINAR CLIENTE DE HOJA DE RUTA", codigo_descripcion: "86 - ELIMINAR CLIENTE DE HOJA DE RUTA", },
    { codigo: "87", descripcion: "AJUSTE EN RESUMENES DIARIOS MAYOR AL PERMITIDO", codigo_descripcion: "87 - AJUSTE EN RESUMENES DIARIOS MAYOR AL PERMITIDO" },
    { codigo: "88", descripcion: "CAMBIAR NOMBRE Y NIT A FACTURAR", codigo_descripcion: "88 - CAMBIAR NOMBRE Y NIT A FACTURAR" },
    { codigo: "89", descripcion: "PERMITIR EMITIR FACTURA VENTA CONTADO", codigo_descripcion: "89 - PERMITIR EMITIR FACTURA VENTA CONTADO" },
    { codigo: "90", descripcion: "CAMBIAR RAZON SOCIAL Y NIT", codigo_descripcion: "90 - CAMBIAR RAZON SOCIAL Y NIT" },
    { codigo: "91", descripcion: "PERMITIR REALIZAR PROFORMA CON CUENTAS EN MORA PENDIENTES", codigo_descripcion: "91 - PERMITIR REALIZAR PROFORMA CON CUENTAS EN MORA PENDIENTES" },
    { codigo: "92", descripcion: "ANULACION DE FACTURAS EN ALMACEN QUE IMPLICA DEVOLUCION DE MERCADERIA", codigo_descripcion: "92 - ANULACION DE FACTURAS EN ALMACEN QUE IMPLICA DEVOLUCION DE MERCADERIA", },
    { codigo: "93", descripcion: "ADICION DE NIT SUCURSALES CONYUGUE NOMBRE DEL PROPIETARIO CON NIT CERO", codigo_descripcion: "93 - ADICION DE NIT SUCURSALES CONYUGUE NOMBRE DEL PROPIETARIO CON NIT CERO", },
    { codigo: "94", descripcion: "OTORGACION DE CREDITO TEMPORAL", codigo_descripcion: "94 - OTORGACION DE CREDITO TEMPORAL", },
    { codigo: "95", descripcion: "CAMBIO DE CARTERA DE CLIENTE CON MODIFICACION DE RUTA", codigo_descripcion: "95 - CAMBIO DE CARTERA DE CLIENTE CON MODIFICACION DE RUTA" },
    { codigo: "96", descripcion: "REIMPRESION DE FACTURA POR CASOS EXCEPCIONALES", codigo_descripcion: "96 - REIMPRESION DE FACTURA POR CASOS EXCEPCIONALES" },
    { codigo: "97", descripcion: "AMPLIACION DE CONTRA ENTREGAS HASTA 2 DIAS", codigo_descripcion: "97 - AMPLIACION DE CONTRA ENTREGAS HASTA 2 DIAS" },
    { codigo: "98", descripcion: "AMPLIACION DE CONTRA ENTREGAS MAYORES A 3 DIAS", codigo_descripcion: "98 - AMPLIACION DE CONTRA ENTREGAS MAYORES A 3 DIAS" },
    { codigo: "99", descripcion: "PROFORMA SIN NOMBRE CON DESCUENTOS DE NIVEL OTRO CLIENTE", codigo_descripcion: "99 - PROFORMA SIN NOMBRE CON DESCUENTOS DE NIVEL OTRO CLIENTE" },
    { codigo: "100", descripcion: "AÑADIR PUNTO DE VENTA ADICIONAL A CLIENTE", codigo_descripcion: "100 - AÑADIR PUNTO DE VENTA ADICIONAL A CLIENTE" },
    { codigo: "101", descripcion: "EDITAR COBRANZA UTILIZADA PARA DESCTO POR DEPOSITO", codigo_descripcion: "101 - EDITAR COBRANZA UTILIZADA PARA DESCTO POR DEPOSITO", },
    { codigo: "102", descripcion: "PERMITIR GRABAR PARA APROBAR PROFORMA CLIENTE COMPETENCIA", codigo_descripcion: "102 - PERMITIR GRABAR PARA APROBAR PROFORMA CLIENTE COMPETENCIA" },
    { codigo: "103", descripcion: "PERMITIR PROFORMA CONTADO SIN ANTICIPO", codigo_descripcion: "103 - PERMITIR PROFORMA CONTADO SIN ANTICIPO" },
    { codigo: "104", descripcion: "PERMITIR VENTA A CLIENTE EN OFICINA SIN CUMPLIR MONTO MINIMO", codigo_descripcion: "104 - PERMITIR VENTA A CLIENTE EN OFICINA SIN CUMPLIR MONTO MINIMO" },
    { codigo: "105", descripcion: "MODIFICAR GEOREFERENCIA Y / O DIRECCION SIN CAMBIO DE RUTA ", codigo_descripcion: "105 - MODIFICAR GEOREFERENCIA Y / O DIRECCION SIN CAMBIO DE RUTA" },
    { codigo: "106", descripcion: "CAMBIAR PRECIO DE ITEM", codigo_descripcion: "106 - CAMBIAR PRECIO DE ITEM", },
    { codigo: "107", descripcion: "PERMITIR VENTA A CLIENTE SIN NOMBRE SIN ENLAZAR A CLIENTE REAL", codigo_descripcion: "107 - PERMITIR VENTA A CLIENTE SIN NOMBRE SIN ENLAZAR A CLIENTE REAL" },
    { codigo: "108", descripcion: "GRABAR PARA APROBAR PROFORMA CLIENTE CON REVERSIONES", codigo_descripcion: "108 - GRABAR PARA APROBAR PROFORMA CLIENTE CON REVERSIONES" },
    { codigo: "109", descripcion: "PERMITIR CREAR CLIENTE COMO EMPRESA", codigo_descripcion: "109 - PERMITIR CREAR CLIENTE COMO EMPRESA" },
    { codigo: "110", descripcion: "PERMITIR DESCUENTO EXTRA SIN TENER LINEA DE CREDITO VIGENTE", codigo_descripcion: "110 - PERMITIR DESCUENTO EXTRA SIN TENER LINEA DE CREDITO VIGENTE" },
    { codigo: "111", descripcion: "PERMITIR OTRO MEDIO DE TRANSPORTE EN PROFORMAS", codigo_descripcion: "111 - PERMITIR OTRO MEDIO DE TRANSPORTE EN PROFORMAS" },
    { codigo: "112", descripcion: "DESCTOS NIVEL DE CLIENTE COMPENTENCIA EN PROFORMA SIN NOMBRE", codigo_descripcion: "112 - DESCTOS NIVEL DE CLIENTE COMPENTENCIA EN PROFORMA SIN NOMBRE" },
    { codigo: "113", descripcion: "PERMITIR PROFORMA CON DESCTOS DE NIVEL SEGUN SOLICITUD", codigo_descripcion: "113 - PERMITIR PROFORMA CON DESCTOS DE NIVEL SEGUN SOLICITUD" },
    { codigo: "114", descripcion: "HABILITAR - DESHABILITAR CLIENTE", codigo_descripcion: "114 - HABILITAR - DESHABILITAR CLIENTE" },
    { codigo: "115", descripcion: "HABILITAR DISTRIBUCION MANUAL DE COBRANZAS", codigo_descripcion: "115 - HABILITAR DISTRIBUCION MANUAL DE COBRANZAS" },
    { codigo: "116", descripcion: "MODIFICAR GEOREFERENCIA Y / O DIRECCION CON CAMBIO DE RUTA", codigo_descripcion: "116 - MODIFICAR GEOREFERENCIA Y / O DIRECCION CON CAMBIO DE RUTA" },
    { codigo: "117", descripcion: "HABILITAR FECHA CLIENTE NOTIFICA DEPOSITO", codigo_descripcion: "117 - HABILITAR FECHA CLIENTE NOTIFICA DEPOSITO" },
    { codigo: "118", descripcion: "DEPOSITOS BANCARIOS DE CLIENTES", codigo_descripcion: "118 - DEPOSITOS BANCARIOS DE CLIENTES" },
    { codigo: "119", descripcion: "SOLICITUD DE PRECIO ZINCADO", codigo_descripcion: "119 - SOLICITUD DE PRECIO ZINCADO" },
    { codigo: "120", descripcion: "RECLAMO CLIENTES", codigo_descripcion: "120 - RECLAMO CLIENTES" },
    { codigo: "121", descripcion: "BORRAR ENLACE COBRANZA CON DEPOSITO", codigo_descripcion: "121 - BORRAR ENLACE COBRANZA CON DEPOSITO" },
    { codigo: "122", descripcion: "TRANSFERIR PROFORMA", codigo_descripcion: "122 - TRANSFERIR PROFORMA" },
    { codigo: "123", descripcion: "CAMBIAR CONDICION VENTA CLIENTE A SOLO CONTADO", codigo_descripcion: "123  -CAMBIAR CONDICION VENTA CLIENTE A SOLO CONTADO" },
    { codigo: "124", descripcion: "CAMBIAR CONDICION VENTA CLIENTE A SOLO CREDITO", codigo_descripcion: "124 - CAMBIAR CONDICION VENTA CLIENTE A SOLO CREDITO" },
    { codigo: "125", descripcion: "CAMBIAR CONDICION VENTA CLIENTE A CONTADO Y CREDITO", codigo_descripcion: "125 - CAMBIAR CONDICION VENTA CLIENTE A CONTADO Y CREDITO" },
    { codigo: "126", descripcion: "ELIMINAR DOCUMENTO DE INVENTARIO FISICO", codigo_descripcion: "126 - ELIMINAR DOCUMENTO DE INVENTARIO FISICO" },
    { codigo: "127", descripcion: "HABILITAR DESCUENTO POR DEPOSITO POR DEPOSITO EN MORA", codigo_descripcion: "127 - HABILITAR DESCUENTO POR DEPOSITO POR DEPOSITO EN MORA" },
    { codigo: "128", descripcion: "PERMITIR CAMBIAR A ESTADO DESPACHAR PROFORMA SIN PAGO", codigo_descripcion: "128 - PERMITIR CAMBIAR A ESTADO DESPACHAR PROFORMA SIN PAGO" },
    { codigo: "129", descripcion: "GENERAR RESUMEN DIARIO AUNQUE NO HAYA DE DIA ANTERIOR", codigo_descripcion: "129 - GENERAR RESUMEN DIARIO AUNQUE NO HAYA DE DIA ANTERIOR" },
    { codigo: "130", descripcion: "PERMITIR VENTA CONTADO CONTRA ENTREGA A CLIENTE DEL INTERIOR", codigo_descripcion: "130 - PERMITIR VENTA CONTADO CONTRA ENTREGA A CLIENTE DEL INTERIOR" },
    { codigo: "131", descripcion: "ACEPTAR NOTA MOVIMIENTO CON NEGATIVO ", codigo_descripcion: "131 - ACEPTAR NOTA MOVIMIENTO CON NEGATIVO" },
    { codigo: "132", descripcion: "CAMBIAR ENLACE DE REGISTRO DE EXTRACTO BANCARIO", codigo_descripcion: "132 - CAMBIAR ENLACE DE REGISTRO DE EXTRACTO BANCARIO" },
    { codigo: "133", descripcion: "REGISTRAR DEPOSITO CLIENTE NOTIFICADO FUERA DE TIEMPO", codigo_descripcion: "133 - REGISTRAR DEPOSITO CLIENTE NOTIFICADO FUERA DE TIEMPO" },
    { codigo: "134", descripcion: "PERMITIR GRABAR PROFORMA CON DESCUENTOS DE NIVEL ANTERIORES", codigo_descripcion: "134 - PERMITIR GRABAR PROFORMA CON DESCUENTOS DE NIVEL ANTERIORES" },
    { codigo: "135", descripcion: "PERMITIR FACTURAR CON SALDO NEGATIVO EN TIENDA", codigo_descripcion: "135 - PERMITIR FACTURAR CON SALDO NEGATIVO EN TIENDA" },
    { codigo: "136", descripcion: "PERMITIR VENTA URGENTE A PROVINCIA SIN CUMPLIR MONTO MINIMO", codigo_descripcion: "136 - PERMITIR VENTA URGENTE A PROVINCIA SIN CUMPLIR MONTO MINIMO" },
    { codigo: "137", descripcion: "PERMITIR ITEMS REPETIDOS EN NOTA DE MOVTO ", codigo_descripcion: "137 - PERMITIR ITEMS REPETIDOS EN NOTA DE MOVTO", },
    { codigo: "138", descripcion: "GRABAR RESUMEN DIARIO CON FACTURAS QUE NO ESTAN EN EL SIN", codigo_descripcion: "138 - GRABAR RESUMEN DIARIO CON FACTURAS QUE NO ESTAN EN EL SIN" },
    { codigo: "139", descripcion: "PERMITIR ITEMS EN PZ CON CANTIDAD EN DECIMAL EN NOTAS DE MOVTO", codigo_descripcion: "139 - PERMITIR ITEMS EN PZ CON CANTIDAD EN DECIMAL EN NOTAS DE MOVTO" },
    { codigo: "140", descripcion: "PERMITIR PEDIDO SIN APLICAR DESCUENTOS VIGENTES", codigo_descripcion: "140 - PERMITIR PEDIDO SIN APLICAR DESCUENTOS VIGENTES" },
    { codigo: "141", descripcion: "PERMITIR GRABAR PROFORMA SIN CUMPLIR CONTROLES", codigo_descripcion: "141 - PERMITIR GRABAR PROFORMA SIN CUMPLIR CONTROLES" },
    { codigo: "142", descripcion: "PERMITIR CAMBIAR ESTADO DE FACTURA EN LINEA", codigo_descripcion: "142 - PERMITIR CAMBIAR ESTADO DE FACTURA EN LINEA" },
    { codigo: "143", descripcion: "PERMITIR CAMBIAR ESTADO DE FACTURA EN LINEA CON EL SIN", codigo_descripcion: "143 - PERMITIR CAMBIAR ESTADO DE FACTURA EN LINEA CON EL SIN" },
    { codigo: "144", descripcion: "PERMITIR CAMBIAR CUF DE FACTURA", codigo_descripcion: "144 - PERMITIR CAMBIAR CUF DE FACTURA" },
    { codigo: "145", descripcion: "PERMITIR PROFORMA CON DESCUENTO ESPECIAL", codigo_descripcion: "145 - PERMITIR PROFORMA CON DESCUENTO ESPECIAL" },
    { codigo: "146", descripcion: "PERMITIR PROFORMA CON DESCUENTO DE LINEA", codigo_descripcion: "146 - PERMITIR PROFORMA CON DESCUENTO DE LINEA" },
    { codigo: "147", descripcion: "GENERAR REMISION CON MONTO TOTAL QUE NO IGUALA CON PROFORMA", codigo_descripcion: "147 - GENERAR REMISION CON MONTO TOTAL QUE NO IGUALA CON PROFORMA" },
    { codigo: "148", descripcion: "PERMITIR PROFORMA CON ENLACE A CLIENTE REFERENCIA NO PERMITIDO", codigo_descripcion: "148 - PERMITIR PROFORMA CON ENLACE A CLIENTE REFERENCIA NO PERMITIDO" },
    { codigo: "149", descripcion: "PERMITIR CAMBIAR ESTADO EN LINEA O FUERA DE LINEA INTERNET", codigo_descripcion: "149 - PERMITIR CAMBIAR ESTADO EN LINEA O FUERA DE LINEA INTERNET" },
    { codigo: "150", descripcion: "PERMITIR CAMBIAR ESTADO EN LINEA O FUERA DE LINEA SERVICIOS SIN", codigo_descripcion: "150 - PERMITIR CAMBIAR ESTADO EN LINEA O FUERA DE LINEA SERVICIOS SIN" },
    { codigo: "151", descripcion: "PERMITIR CAMBIAR CODIGO FACTURA WEB DE FACTURA", codigo_descripcion: "151 - PERMITIR CAMBIAR codigo_descripcion FACTURA WEB DE FACTURA" },
    // { codigo: "152", descripcion: "1" },
    // { codigo: "153", descripcion: "1" },
    // { codigo: "154", descripcion: "1" },
    // { codigo: "155", descripcion: "1" },
    // { codigo: "156", descripcion: "1" },
    // { codigo: "157", descripcion: "1" },
    // { codigo: "158", descripcion: "1" },
    // { codigo: "159", descripcion: "1" },
    // { codigo: "160", descripcion: "1" },
    // { codigo: "161", descripcion: "1" },
    // { codigo: "162", descripcion: "1" },
    // { codigo: "163", descripcion: "1" },
    // { codigo: "164", descripcion: "1" },
    // { codigo: "165", descripcion: "1" },
    // { codigo: "166", descripcion: "1" },
    // { codigo: "167", descripcion: "1" },
    // { codigo: "168", descripcion: "1" },
    // { codigo: "169", descripcion: "1" },
    // { codigo: "170", descripcion: "1" },
    // { codigo: "171", descripcion: "1" },
    // { codigo: "172", descripcion: "1" },
    // { codigo: "173", descripcion: "1" },
    // { codigo: "174", descripcion: "1" },
    // { codigo: "175", descripcion: "1" },
    // { codigo: "176", descripcion: "1" },
    // { codigo: "177", descripcion: "1" },
    // { codigo: "178", descripcion: "1" },
    // { codigo: "179", descripcion: "1" },
    // { codigo: "180", descripcion: "1" },
  ];

  textControl: FormControl;

  userConn: string;
  data_text_area: any = [];
  BD_storage: any = [];
  contrasenia: string;
  data_autorizacionA: any = [];
  data_autorizacionB: any = [];
  data_servicio: any = [];
  data_cod_almacen: any = [];
  contrasenia_recibida: any = [];
  autorizacion_recibida: any = [];

  constructor(private api: ApiService, public dialog: MatDialog, public dialogRef: MatDialogRef<ModalPasswordComponent>,
    public log_module: LogService, private toastr: ToastrService, public _snackBar: MatSnackBar,
    public modalAutorizacion: ModalGenerarAutorizacionComponent, private clipboard: Clipboard,
    public almacenservice: ServicioalmacenService, @Inject(MAT_DIALOG_DATA) public dataA: any,
    @Inject(MAT_DIALOG_DATA) public dataB: any, @Inject(MAT_DIALOG_DATA) public sevicio_select: any,
    @Inject(MAT_DIALOG_DATA) public cod_almacen: any,) {

    this.data_autorizacionA = this.dataA.dataA;
    this.data_autorizacionB = this.dataB.dataB;
    this.data_cod_almacen = this.cod_almacen.cod_almacen;

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    console.log(this.BD_storage.bd);


    this.data_servicio = this.sevicio_select.sevicio_select;
    this.data_text_area = this.autorizacion.find(x => x.codigo == this.data_servicio);
  }

  ngOnInit() {
  }

  getaAutorizacion() {
    console.log(this.data_servicio, this.data_autorizacionA, this.data_autorizacionB);
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/seg_adm/oper/prgcontrasena/passwordAut/"
    return this.api.getAll('/seg_adm/oper/prgcontrasena/passwordAut/' + this.userConn + "/" + this.BD_storage.bd + "/" + this.data_servicio + "/" + this.contrasenia)
      .subscribe({
        next: (datav) => {
          this.autorizacion_recibida = datav;
          console.log(this.autorizacion_recibida);

          if (datav = 712) {
            this._snackBar.open('¡ Permiso Autorizado !' + this.autorizacion_recibida.resp, '☑️', {
              duration: 12000,
              panelClass: ['coorporativo-snackbar', 'login-snackbar'],
            });
            this.getPassword();
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getPassword() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/seg_adm/oper/prgGenPass/genAutEspecial/"
    return this.api.getAll('/seg_adm/oper/prgGenPass/genAutEspecial/' + this.data_cod_almacen + "/" + this.data_autorizacionA + "/" + this.data_autorizacionB + "/" + this.data_servicio)
      .subscribe({
        next: (datav) => {
          this.contrasenia_recibida = datav;
          console.log(this.contrasenia_recibida);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  copyToClipboard(): void {
    let copia = "Codigo Servicio: " + this.data_servicio + "Dato A: " + this.data_autorizacionA + "Dato B: " + this.data_autorizacionB
    // Se copia el texto del input al portapapeles
    this.clipboard.copy(copia);

    // Se muestra un snackbar durante 2 segundos en la parte inferior
    this._snackBar.open('¡ Texto Copiado !', '📑', {
      duration: 2000,
      panelClass: ['coorporativo-snackbar', 'login-snackbar'],
    });
  }

  copyToClipboardPassword(): void {
    // Se copia el texto del input al portapapeles
    this.clipboard.copy(this.contrasenia_recibida.resp);

    // Se muestra un snackbar durante 2 segundos en la parte inferior
    this._snackBar.open('¡ Contraseña Copiada !', '📑', {
      duration: 2000,
      panelClass: ['coorporativo-snackbar', 'login-snackbar'],
    });
  }

  close() {
    this.dialogRef.close();
  }
}
