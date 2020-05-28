import React from 'react';
import { Provider } from 'react-redux'
import { Container } from 'reactstrap'
import Logout from './auth/logout'
import { BrowserRouter as Router } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import store from '../store'
import { loadUser } from '../actions/authActions'
import { ReactComponent as SnapLogo } from './logo_snap.svg'
import Home from './Home'
import Profile from './Profile'

class Page extends React.Component {
  componentDidMount() {
    store.dispatch(loadUser())
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    const { user, isAuthenticated, isLoading } = this.props.auth
    return (
      <>
          {!isLoading ? isAuthenticated ? <Profile /> : <Home /> : null}
      </>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Page)