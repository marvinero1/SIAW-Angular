import { createAction, props } from '@ngrx/store';

// Definición de acciones
export const LOGIN_USER = '[Auth] Login User';
export const LOGOUT_USER = '[Auth] Logout User';
export const LOAD_USER = '[Auth] Load User';

// Acción de login con payload
export const LoginUser = createAction(
    LOGIN_USER,
    props<{ payload: string }>() // Aquí definimos que payload es un string
);

// Acción de logout sin payload
export const LogoutUser = createAction(LOGOUT_USER);

// Acción de carga de usuario con payload (puede ser un objeto o lo que necesites)
export const LoadUser = createAction(
    LOAD_USER,
    props<{ payload: { email: string; picture: any } }>() // Asegúrate de definir el tipo adecuado para el payload
);
