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
import Cam from './Camera'
import Local from './user/pickFile'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import axios from 'axios'


class Profile extends React.Component {
  state = {
    cam: false,
    local: false,
    snaps: []
  }

  customToastId = 'xxx-yyy'


  componentDidMount() {
    this.getAll()
    // setTimeOut(getAll())
    store.dispatch(loadUser())
    toast.dismiss()
    this.camError()
  }

  getAll = () => {
    const config = {
      headers: {
        "token": this.props.auth.user.token
      }
    }
    axios.get('http://snapi.epitech.eu/snaps', config)
      .then(res => {
        this.setState({ snaps: res.data.data })
      })
      .catch(err => {
        toast.error('Error getting all snaps')
        console.log(err)
      })
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

  showSnap = (e) => {
    const snap_id = e.target.getAttribute('value')
    const config = {
      headers: {
        "token": this.props.auth.user.token
      }
    }
    axios.get(`http://snapi.epitech.eu/snap/${snap_id}`, config)
      .then(res => {
        console.log(res.data)
        this.setState({ snaps: res.data.data })
      })
      .catch(err => {
        //disconnect user
        // dispatch()
        toast.error('Error getting all snaps')
        console.log(err)
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
                {this.state.snaps.map(snap => {
                 return <>
                    <div
                    onClick={e => this.showSnap(e)}
                      value={snap.snap_id}
                      style={{ height: 2 + '%' }}
                    >===> {snap.from}</div>
                    <hr />
                  </>
                })}
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