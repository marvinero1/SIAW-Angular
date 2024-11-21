import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './actions';

const initialState = {
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    currentUser: {
        email: 'mail@example.com',
        picture: null
    }
};

const _authReducer = createReducer(
    initialState,
    on(AuthActions.LoginUser, (state, { payload }) => {
        localStorage.setItem('token', payload);
        return {
            ...state,
            isLoggedIn: true,
            token: payload
        };
    }),
    on(AuthActions.LogoutUser, (state) => {
        localStorage.removeItem('token');
        return {
            ...state,
            isLoggedIn: false,
            token: null,
            currentUser: { email: '', picture: null } // Resetea el usuario actual
        };
    }),
    on(AuthActions.LoadUser, (state, { payload }) => {
        return {
            ...state,
            currentUser: payload // Suponiendo que el payload tiene el formato correcto
        };
    })
);

export function authReducer(state: any, action: Action) {
    return _authReducer(state, action);
}
