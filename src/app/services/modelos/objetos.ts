export interface UsuarioActual {
  bd: string;
  login: string;
  password: string;
}
export interface adUsuario {
  id: number;
  login: string;
  password: string;
  password_siaw: string,
  persona: number;
  vencimiento: string;
  activo: number;
  correo: string;
  codrol: string;
  horareg: string;
  fechareg: string;
  fechareg_siaw:string;
  usuarioreg: string;
}

export interface pePersona {
    id: string,
    codigo: number,
    nombre1: string,
    nombre2: string,
    apellido1: string,
    apellido2: string,
    sexo: boolean,
    fechanac: Date,
    idtipo: number,
    idexpedido: number,
    idnumero: number,
    idvenc: Date,
    codestadocivil: number,
    numlibmili: string,
    brevet: boolean,
    categoria: string,
    tipo: number,
    venbrevet: Date,
    padronrenta: string,
    padronmunicipal: string,
    paisreside: string,
    telefonodom: number,
    celular: number,
    numseguro: string,
    codafp: number,
    codbanco: string,
    cuentabanco: string,
    obs: string,
    fechaingreso: Date,
    fechaegreso: Date,
    codalmacen: number,
    estado: string,
    horareg: string,
    fechareg: Date,
    usuarioreg: string,
    direccion: string,
    refdireccion: string,
    email: string,
    brevetauto: string,
    moto: boolean,
    brevetmoto: string,
    venbrevetmoto: string,
    obsnombre: string,
    obsnacimiento: string,
    obsdocumentos: string,
    salud: number,
    codobrasocial: string,
    codsindicato: string,
    codprofesion: number,
    codregimen: number,
    codlocalidad: string,
    provincia: string,
    tarea: string,
    nroexplotacion: string,
    aporte: number,
    codcategoria: string,
    pago: number,
    convenio: number,
    condicion: number,
    sueldo: number,
    adicional: number,
    porevaluacion: number,
    cuil: string,
    codactividad: number,
    codcondlaboral: number,
    codmodcontrato: number,
    localidad: string,
    codfederacion: number,
    codsitrevista: number,
    codnacionalidad: number,
    codtarea: number,
    codpostal: string,
    pagar_con_cheque: boolean,
    nua: string,
    recibe_vacaciones: boolean,
    latitud: string,
    longitud: string,
    codtipo_contrato: string,
    coddependiente: string,
}

export interface Rol {
  codigo: string,
    descripcion: string,
    horareg: string,
    fechareg: Date,
    usuarioreg: string,
    dias_cambio: number,
    long_minima: number,
    con_numeros: boolean,
    con_letras: boolean,
    contabilizar: boolean,
    contabiliza: boolean
}

export interface Moneda {
  codigo: string,
    codmoneda_sin: string,
    decimales: string,
    fechareg: Date,
    usuarioreg: string,
    descripcion: number,
    horareg: number,
}

export interface Area {
  codigo: string,
    codmoneda_sin: string,
    decimales: string,
    fechareg: Date,
    usuarioreg: string,
    descripcion: number,
    horareg: number,
}

export interface Item {
  codigo: string,
    descripcion: string,
    descripcorta: string,
    descripabr: string,
    medida: string,
    unidad: string,
    rosca: string,
    terminacion: string,
    peso: number,
    codlinea: string,
    clasificacion: string,
    kit: true,
    estadocv: string,
    costo: number,
    monedacosto: string,
    codresistencia: string,
    horareg: string,
    fechareg: Date,
    usuarioreg: string,
    enlinea: true,
    saldominimo: number,
    codigobarra: string,
    reservastock: true,
    iva: number,
    codmoneda_valor_criterio: string,
    porcen_gac: number,
    nandina: string,
    usar_en_movimiento: true,
    paga_comision: true,
    porcen_saldo_restringido: number,
    controla_negativo: true,
    tipo: string,
    codproducto_sin: string
}

export interface Almacen {
  codigo: number,
    descripcion: string,
    codarea: number,
    direccion: string,
    telefono: string,
    email: string,
    tienda: true,
    codplanporcen: number,
    nropersonas: number,
    estandar: number,
    monestandar: string,
    minimo: number,
    moneda: string,
    nropatronal: string,
    horareg: string,
    fechareg: Date,
    usuarioreg: string,
    lugar: string,
    sucursallc: string,
    min_solurgente: number,
    codmoneda_min_solurgente: string,
    pesomin: number,
    pesoest: number,
    porcenmin: number,
    porcenmin_rendi: number,
    pesoest_rendi: number,
    pesomin_rendi: number,
    idcuenta_caja_mn: string,
    idcuenta_caja_me: string,
    graficar: true,
    analizar_rendimiento: true,
    actividad: string,
    latitud: string,
    longitud: string,
    fax: string
}

export interface inLineaProducto {
  codigo: string;
  descripcion: string;
  codgrupo: number;
  descdetallada: string;
  codgrupomer: number;
  codsubgrupo_vta: string;
  porcentaje_comis: number;
  horareg: string;
  fechareg: string;
  usuarioreg: string;
}

export interface Roles {
  codigo:string;
  con_letras:boolean;
  con_numeros:boolean;
  contabiliza:string;
  contabilizar:false;
  descripcion:string;
  dias_cambio:Number;
  fechareg:Date;
  horareg:string;
  long_minima:Number;
  usuarioreg:string;
}

export interface veCliente {
codigo:string;
moneda:string;
razonsocial:string;
casilla:string;
nit:string;
credito:number;
fvenccred:string;
creditodisp:number;
codvendedor:number;
fapertura:string;
obs:string;
email:string;
garantia:string;
codplanpago:number;
codrubro:string;
horareg:string;
fechareg:Date;
usuarioreg:string;
habilitado:boolean;
tipoventa:number;
condicion:string;
max_nits:number;
controla_maximo:boolean;
situacion:string;
codtipo_identidad:string;
discrimina_iva:boolean;
codlocalidad:string;
nroingresosbrutos:string;
tipofactura:string;
tiponotacredito:string;
iva:number;
clasificacion:string;
coddsctos_credito:number;
cartera:string;
solo_pp:boolean;
contra_entrega:boolean;
tipo:string;
controla_empaque_cerrado:boolean;
controla_precios:boolean;
visitas_x_mes:number;
maximo_vta:number;
codmoneda_maximo_vta:string;
codvendedor_asignado:number;
permite_items_repetidos:boolean;
dias_reversion_items_especiales:number;
codzona:string;
es_cliente_final:boolean;
controla_empaque_minimo:boolean;
controla_monto_minimo:boolean;
nombre_contrato:string;
ci_contrato:string;
ci:string;
nombre_fact:string;
nit_fact:string;
ruta:string;
nombre_comercial:string;
es_empresa:boolean;
permitir_vta_rango_mediomay:boolean;
permitir_vta_rango_minorista:boolean;
nropoder:string;
ciudad_titular:string;
zona_titular:string;
direccion_titular:string;
refdireccion_titular:string;
telefono_titular:string;
celular_titular:string;
latitud_titular:string;
longitud_titular:string;
obs_titular:string;
imprimir_tdc:boolean;
cliente_pertec:boolean;
ruta1:string;
porcentaje_limite_descto_deposito:number;
casual:boolean;
tipo_docid:number;
complemento_ci:string;
tipo_personeria_cliente_final:number;
permite_desc_caja_cerrada:boolean;
motivo_excepcion_clien_final:string;
}

export interface veTiendaDireccion {
  codigo:number
  codcliente:string,
  direccion:string,
  telefono:string,
  fax:string,
  celular:string,
  email:string,
  codptoventa:number,
  central:boolean
  obs:string,
  horareg:string,
  fechareg:string,
  usuarioreg:string,
  aclaracion_direccion:string,
  latitud:string,
  longitud:string,
  telefono_2:string,
  celular_2:string,
  celular_3:string,
  celular_whatsapp:string,
  nomb_telf1:string,
  nomb_telf2:string,
  nomb_cel1:string,
  nomb_cel2:string,
  nomb_cel3:string,
  nomb_whatsapp:string,
}

export interface inAlmacen {
  codigo:number,
  descripcion:string,
  codarea:number,
  direccion:string,
  telefono:string,
  email:string,
  tienda:boolean
  codplanporcen:number,
  nropersonas:number,
  estandar:number,
  monestandar:string,
  minimo:number,
  moneda:string,
  nropatronal:string,
  horareg:string,
  fechareg:string,
  usuarioreg:string,
  lugar:string,
  sucursallc:string,
  min_solurgente:number,
  codmoneda_min_solurgente:string,
  pesomin:number,
  pesoest:number,
  porcenmin:number,
  pesomin_rendi:number,
  pesoest_rendi:number,
  porcenmin_rendi:number,
  idcuenta_caja_mn:string,
  idcuenta_caja_me:string,
  graficar:boolean,
  analizar_rendimiento:boolean,
  latitud:string,
  longitud:string,
  fax:string,
  actividad:string,
}

export interface veVendedor {
  codigo:number,
  descripcion:string,
  codpersona:number,
  almacen:number,
  codcomisiones:number,
  comisionista:boolean
  estandar:number,
  monestandar:string
  montomin:number,
  moneda:string,
  horareg:string,
  fechareg:string,
  usuarioreg:string,
  clave:string,
  pesomin:number,
  pesoest:number,
  porcenmin:number,
  pesomin_rendi:number,
  pesoest_rendi:number,
  porcenmin_rendi:number,
  porcencomventas:number,
  porcencomcbzas:number,
  mingarantizado:number,
  graficar:boolean,
  analizar_rendimiento:boolean,
  porcentaje_crecimiento:number,
  rastrear_gps:boolean,
  es_pyme:boolean,
}

export interface inTarifa {
  codigo:number,
  descripcion:string,
  monedabase:string,
  codempaque:number,
  desitem:boolean,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  reserva_stock_urg:boolean,
  min_nuevo_credito:number,
  min_entrega_credito:number,
  min_credito:number,
  min_nuevo_contado:number,
  min_entrega_contado:number,
  min_contado:number,
  codmoneda_min_nuevo_credito:string,
  codmoneda_min_entrega_credito:string,
  codmoneda_min_credito:string,
  codmoneda_min_nuevo_contado:string,
  codmoneda_min_entrega_contado:string,
  codmoneda_min_contado:string,
  solo_empaque_cerrado:boolean,
  permitir_empaques_mixtos:boolean,
  codempaque_alternativo:number,
  version:string,
  tipo:string,
  min_contra_entrega:number,
  codmoneda_min_contra_entrega:string,
  montomin:number,
  moneda:string,
  vta_cte_final_desde:number,
  vta_cte_final_hasta:number,
}

export interface veDescuento {
  codigo:number,
  descripcion:string,
  codempaque:number,
  monto:number,
  moneda:string,
  descuento:number,
  ultimos:boolean,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface veNumeracion {
  id:string,
  descripcion:string,
  nroactual:string,
  tipodoc:string,
  habilitado:boolean,
  descarga:boolean,
  horareg:string,
  fechareg:string,
  codunidad:string,
  reversion:boolean,
  tipo:string,
  usuarioreg:string,
}

export interface Menu {
  name: string;
  iconClasses: string;
  path: string[];
}

export interface Autorizacion {
  codigo:string,
  descripcion:string,
  codigo_descripcion:string,
}

export interface Localidades {
  codigo:string,
  descripcion:string,
  provincia:string,
  codigo_postal:string,
  horareg:string,
  fechareg:string,
  usuarioreg:string,
}

export interface IDProforma {
  id: string,
  descripcion:string,
  nroactual: number,
  tipodoc: number,
  habilitado: boolean,
  descarga: boolean,
  horareg:string,
  fechareg: string,
  usuarioreg:string,
  codunidad:string,
  reversion:boolean,
  tipo:string
}

export interface Rubro {
  codigo:string,
  descripcion:string,
  horareg: string,
  fechareg: string,
  usuarioreg: string
}

export interface Vehiculo {
  placa:string,
  descripcion:string,
  horareg: string,
  fechareg: string,
  usuarioreg: string,
  activo:boolean,
}

export interface AutorizacionEspecial {
  codigo:number,
  nivel:number,
  vencimiento: string,
  codpersona: number,
  obs: string,
  nomPerson:string,
}

export interface CatalogoInventario {
  id: string,
  nroactual: number,
  descripcion: string,
  horareg: string,
  fechareg: Date,
  usuarioreg: string,
}

export interface ConsolidacionInventario {
  codigo: number;
  consolidado: boolean;
  nro: number;
  obs: string;
}

export interface Zona {
  codigo: string,
  descripcion: string,
  horareg: string,
  fechareg: Date,
  usuarioreg: string,
}

export interface inMovimiento {
  id: string,
  descripcion: string,
  codunidad: string,
  nroactual: string,
  horareg: string,
  fechareg: Date,
  usuarioreg: string,
}

export interface inConcepto {
  codigo:string,
  descripcion: string,
  factor: string,
  traspaso:string,
  porcosto: string,
  codtarifa: string,
  codcontra_concepto,
  nroactual: string,
  usuario_final:boolean,
  cliente:string,
  horareg: string,
  fechareg: Date,
  usuarioreg: string,
}
export interface vePuntoVenta {
  codigo: string,
  abreviacion:string,
  descripcion: string,
  codprovincia: string,
  ptolocal: boolean,
  permitido:string,
  tipo: string,
  ubicacion: string,
  horareg: string,
  fechareg: Date,
  usuarioreg: string,
}

export interface adProvincia {
  codigo: string,
  nombre:string,
  coddepto: string,
  horareg: string,
  fechareg: Date,
  usuarioreg: string,
}

export interface veLugar {
  codigo: string,
  descripcion: string,
  direccion: string,
  obs: string,
  codzona: string,
  latitud: string,
  longitud:string,
  puntear: boolean,
  codpersona:string,
  coddepto: string,
  horareg: string,
  fechareg: Date,
  usuarioreg: string,
}

export interface veClientesIguales {
  codcliente_a: string,
  codcliente_b: string,
  codalmacen: string,
}

export interface veRecargo {
  codigo:	number,
  descorta:string,
  descripcion:string,
  porcentaje:number,
  monto:number,
  moneda:number,
  montopor:boolean,
  modificable:boolean,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface periodoSistema {
  ano: number,
  mes: number,
  codigo: number,
  sistema: number,
  descricpion: string,
  check:boolean,
}

export interface fnTipoTransferencia {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface fnTipoRetiro {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface fnTipoReposicion {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface fnTipoPagoAdeudor  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface fnTipoCambio  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface fnTipoLibroBanco  {
  id: string,
  descripcion: string,
  nroactual: number,
  codcuentab: string,
  desde: Date,
  hasta: Date,
  origen: string,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface fnTipoEntrega  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface fnTipoDevolucion  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface fnTipoDepositoCliente  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface fnTipoDeposito  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface fnNumeracionChequeCliente  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface fnDeudorCompuesto  {
  id: string,
  descripcion: string,
  fechareg:Date,
  usuarioreg:string,
  horareg:string,
}
export interface fnDeudor  {
  id: string,
  descripcion: string,
  fechareg:Date,
  usuarioreg:string,
  horareg:string,
  codperson: number,
}
export interface fnCuenta  {
  id: string,
  descripcion: string,
  fechareg:Date,
  usuarioreg:string,
  horareg:string,
  balance: number,
  fecha: Date,
  codmoneda: string,
  tipo_movimiento: string
}
export interface fnNumeracionChequeCliente  {
  id: string,
  nrodesde: number,
  nrohasta: number,
  nroactual: number,
  descripcion: string,
  codcuentab: string,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}
export interface fntipo_librobanco  {
  id: string,
  descripcion: string,
  nroactual: number,
  codcuentab: string,
  desde: string,
  hasta: string,
  origen: string,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}
export interface fncuenta  {
  id: string,
  descripcion: string,
  balance: number,
  fecha: string,
  codmoneda: string,
  tipo_movimiento: string,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface fndeudor  {
  id: string,
  descripcion: string,
  codperson: string,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface cmtipocompra  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface cmtipoprovision  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface cppercepcion {
  codigo: number,
  descripcion: string,
  porcentaje: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface banco {
  codigo: string,
  nombre: string,
  direccion: string,
  nit: string,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface fndeudor_compuesto {
  id: string,
  descripcion: string,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface cotipoanticipo  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface cotipodevanticipo  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface cotipopagomora  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface cotipodescuento_mora  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface cotipodescuento_faltante  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface cotippago  {
  codigo: number,
  descripcion: string,
  tipo: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface cotipoajuste  {
  id: string,
  descripcion: string,
  nroactual: number,
  usuarioreg:string,
  horareg:string,
  fechareg:Date,
}

export interface cotalonario  {
  codigo: string,
  descripcion: string,
  TalDel: number,
  TalAl: number,
  nroactual: number,
  Fecha: Date,
  horareg:string,
  fechareg:Date,
  Usuarioreg:string,
  codvendedor: number,
}
export interface cotipo  {
  id: string,
  descripcion: string,
  nroactual: number,
  codvendedor: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface vetiposoldesct  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
  codunidad: string,
}

export interface cpidodc  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface cpidembarque  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface cpidrecepcion  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface cpidproforma  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface cpidpedido  {
  id: string,
  descripcion: string,
  nroactual: number,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface cnsucursal  {
  codigo: string,
  codalmacen: number,
  descripcion: string,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}

export interface cnplancuenta  {
  codigo: number,
  descripcion: string,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}
export interface moneda  {
  codigo: number,
  descripcion: string,
  horareg:string,
  fechareg:Date,
  usuarioreg: string,
  decimales: string,
  codmoneda_sin: string,
}
export interface cnnumeracion  {
  id: string,
  descripcion: string,
  nroactual: number,
  ajuste: boolean,
  desde: Date,
  hasta: Date,
  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}
export interface cncuenta  {
  codigo: string,
  descripcion: string,
  nivel: number,
  imputable: boolean,
  moneda: string,
  tipo:number,
  clase: number,
  codplan: number,
  codcuentapadre: number,
  creaaux: boolean,
  ajuste_ajustar: boolean,
  ajuste_modo: number,
  ajuste_codmoneda: string,
  ajuste_codcuenta: string,
  ajustar_moneda: boolean,
  ajuste_codcuenta_aplicacion: string,
  ajuste_saldoinicial: boolean,

  horareg:string,
  fechareg:Date,
  usuarioreg:string,
}