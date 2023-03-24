import { configureStore } from '@reduxjs/toolkit'
import {combineReducers, createStore, applyMiddleware} from 'redux';
import { Reducer, initialState } from './reducer'

export const ConfigureStore = () => {
    const store = createStore( 
        combineReducers({
            Reducer,
            initialState
        }),
    );

    return store;
}