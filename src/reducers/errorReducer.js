import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types'

const initialState = {
    msg: {},
    status: null,
    id: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            // console.log("this is in the reducer", action.payload)
            return {
                msg: action.payload.errors,
                status: action.payload.status,
                id: action.payload.id
            }
        case CLEAR_ERRORS:
            return {
                msg: {},
                status: null,
                id: null
            }
        default:
            return state
    }
}