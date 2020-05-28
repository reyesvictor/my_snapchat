import { GET_ERRORS, CLEAR_ERRORS } from './types'

export const returnErrors = (data, status, id = null) => {
    // console.log(data, status, id)
    let errors = []
    switch (id) {
        case "REGISTER_FAIL":
            if (data.data.email) {
                errors.push("Email: " + data.data.email[0] + "  ")
            }
            if (data.data.password) {
                errors.push("Password: " + data.data.password[0])
            }
            break;
        case "LOGIN_FAIL":
            errors.push(data.data)
            break;
    }
    return {
        type: GET_ERRORS,
        payload: { errors, status, id }
    }
}

//clear errors

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    }
}