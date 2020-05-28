import React from 'react';
import { Provider } from 'react-redux'
import { Container } from 'reactstrap'
import LoginForm from './auth/loginForm'
import RegisterForm from './auth/registerForm'
import Logout from './auth/logout'
import { BrowserRouter as Router } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import store from '../store'
import { loadUser } from '../actions/authActions'
import { ReactComponent as SnapLogo } from './logo_snap.svg'


class Home extends React.Component {


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
        <div
          style={{
            background: '#fffc01',
            height: 100 + 'vh',
          }}>
          <SnapLogo
          style={{
            position:'fixed', 
            top: 22.5 + 'vh',
            left: 42 + 'vw',
          }}/>
          <LoginForm />
          <RegisterForm />
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Home)