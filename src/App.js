import React from 'react';
import { Provider } from 'react-redux'
import { Container } from 'reactstrap'
import Page from './components/Page'
import Profile from './components/Profile'
// import IndexNavbar from './components/IndexNavbar'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import store from './store'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <Page />
        </Provider>
      </Router>
    )
  }
}

export default App