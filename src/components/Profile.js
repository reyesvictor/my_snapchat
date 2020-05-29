import React from 'react'
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
    snaps: [],
    snap_showing: false,
    imagedata: '',
    timeleft: 0,
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
        const snaps_temp = res.data.data
        this.setState({ snaps: snaps_temp.reverse() })
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

    const duration = this.state.snaps.filter(snap => snap.snap_id == snap_id)[0].duration
    console.log('duration', duration)

    fetch(`http://snapi.epitech.eu/snap/${snap_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
        'token': this.props.auth.user.token
      },
    })
      .then((response) => response.blob())
      .then((blob) => {

        const url = window.URL.createObjectURL(new Blob([blob]))

        this.setState({ snap_showing: true, imagedata: url, timeleft: duration })
        this.setIntervalShow()
        const timer = setTimeout(() => {
          this.setState({ snap_showing: false })
          this.showSeen(snap_id)
        }, duration * 1000)
        return () => {
          clearTimeout(timer)
        }
      })
      .catch(async err => {
        toast.error('Error getting this snap')
      })
  }

  setIntervalShow = () => {
    const interval = setInterval(() => {
      this.setState({ timeleft: (this.state.timeleft - 1) })
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }


  showSeen = (id) => {
    console.log("hello")
    const config = {
      headers: {
        "Content-Type": "application/json",
        "token": this.props.auth.user.token
      }
    }
    const body = { id: id }

    axios.post('http://snapi.epitech.eu/seen', body, config)
      .then(res => {
        toast.success(res.data.data)
        this.getAll()
      })
      .catch(err => {
        toast.error('didnt mark as seen')
      })
  }

  render() {
    const { user, isAuthenticated, isLoading } = this.props.auth
    return (
      <>
        <ToastContainer />
        {!this.state.snap_showing ?
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
          :
          <>
            <button>{this.state.timeleft}</button>
            <img src={this.state.imagedata} />
          </>
        }
      </>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Profile)