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
import { Button } from 'reactstrap'
import Cam from './Camera'
import Local from './user/pickFile'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

class Profile extends React.Component {
  state = {
    cam: false,
    local: false
  }

  customToastId = 'xxx-yyy'


  componentDidMount() {
    store.dispatch(loadUser())
    toast.dismiss()
    this.camError()
  }
  camError = () => {
    if (this.props.error && !toast.isActive(this.customToastId)) {
      toast.error("There was an issue with your camera", {
        toastId: this.customToastId
      })
    }
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  cam = () => {
    this.setState({
      cam: !this.state.cam
    })
  }

  local = () => {
    this.setState({
      local: !this.state.local
    })
  }

  render() {
    const { user, isAuthenticated, isLoading } = this.props.auth
    return (
      <>
        <ToastContainer />
        {
          this.state.local ?
            <Local />
            :
            this.state.cam ?
              <Cam />
              :
              <div
                style={{
                  background: 'white',
                  height: 100 + 'vh',
                }}>
                <Logout />
                <hr />
                <div style={{ height: 2 + '%' }}>===> New Message From Antonio</div>
                <hr />
                <div style={{ height: 2 + '%' }}>===> New Message From Antonio</div>
                <hr />
                <div style={{ height: 2 + '%' }}>===> New Message From Antonio</div>
                <hr />
                <div style={{ height: 2 + '%' }}>===> New Message From Antonio</div>
                <hr />

                <button style={{
                  borderRadius: 100 + '%',
                  // position: 'fixed',
                  bottom: 1,
                  right: 1,
                }}
                  onClick={this.cam}
                >O</button>

                <button style={{
                  borderRadius: 100 + '%',
                  bottom: 1,
                  right: 1,
                }}
                  onClick={this.local}
                >Local</button>
              </div>
        }
      </>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Profile)