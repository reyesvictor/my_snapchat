import axios from 'axios'
import {
    USER_LOADED,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    LOGOUT_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    AUTH_ERROR,
    USER_LOADING
} from '../actions/types'
import { returnErrors } from './errorActions'

// dispatch is a function of the Redux store. You call store.dispatch to dispatch an action. This is the only way to trigger a state change.
// check token first and then load the user
// THIS FONCTION CHECKS IF TOKEN/EMAIL IS IN STATE, IF SO, THE USER IS LOGGED IN
export const loadUser = () => (dispatch, getState) => {
    // headers 
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    // loading user
    dispatch({ type: USER_LOADING })

    if (localStorage.getItem('auth')) {
        dispatch({
            type: USER_LOADED,
            // res.data is an object with user object and the token
            payload: JSON.parse(localStorage.getItem('auth'))
        })
        console.log("The token exists")
    }
    else {
        dispatch({
            type: AUTH_ERROR
        })
        console.log("The token does not exist")
    }
    // if token and email are in the state, it means the user has already logged in
    // if (token in state)
    //     user_loaded
}

// FUNCTION THAT ACTUALLY LOGS IN WITH BODY{EMAIL, PASSWORD}
export const login = ({ email, password }) => dispatch => {
    // headers 
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    //request info
    const body = JSON.stringify({ email, password })

    axios.post('http://snapi.epitech.eu/connection', body, config)
        .then(res => dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'))
            dispatch({
                type: LOGIN_FAIL
            })
        })
}

// Register User
export const register = ({ email, password }) => dispatch => {
    // headers 
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    //request info
    const body = JSON.stringify({ email, password })

    axios.post('http://snapi.epitech.eu/inscription', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'))
            dispatch({
                type: REGISTER_FAIL
            })
        })
}

// // setup function for token/headers
// export const tokenConfig = getState => {
//     // getting token
//     const token = getState().auth.token

//     // headers
//     const config = {
//         headers: {
//             "Content-type": "application/json"
//         }
//     }

//     // if token is good, add it to headers
//     if (token) {
//         config.headers['x-auth-token'] = token
//     }
//     return config
// }

//logout no need for dispatch
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}