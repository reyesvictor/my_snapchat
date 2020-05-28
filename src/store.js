import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/index'

const initialState = {}

const middleware = [thunk]

const store = createStore(rootReducer, initialState, compose(
    // Phone, and take  IPv4 Address + Port. ex:  192.168.1.52:3000
    compose(applyMiddleware(...middleware))
    // PC -dev
    // compose(applyMiddleware(...middleware),window.__REDUX_DEVTOOLS_EXTENSION__())
))

export default store