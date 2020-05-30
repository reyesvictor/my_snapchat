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

    const getAll = setInterval(() => {
      this.getAll()
    }, 1000)
    return () => getAll
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

  setIntervalShow = async () => {
    const interval = await setInterval(async () => {
      let timeleft = this.state.timeleft
      if (this.state.timeleft > 0) {
        await this.setState({ timeleft: (timeleft - 1) })
      } else {
        clearInterval(interval)
        return
      }
    }, 1000)
    return () => interval
  }

  showSeen = (id) => {
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
        <div style={{ height: 100 + 'vh', background:'#282c34' }}>
        {!this.state.snap_showing ?
          this.state.local ?
            <Local />
            :
            this.state.cam ?
              <Cam />
              :
              <div
                style={{
                  background: '#282c34',
                  height: 100 + 'vh',
                  color: '#e7eee0',
                  fontSize: 2.5 + 'vh',
                }}>


                <div
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    justifyContent: 'center',
                    padding: 2 + 'vw',
                    background: 'beige',
                    color: 'black',
                  }}
                >
                  App by Antonio Tina and Victor Reyes
                </div>

                <div
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    justifyContent: 'center',
                    padding: 2 + 'vw',
                    background: '#282c34',
                  }}
                >
                  {this.state.snaps.length ? `You received ${this.state.snaps.length} snaps !` : ` You didn't receive anything yet !`}

                </div>

                <hr id="firsthr" style={{ marginTop: 0, background: 'white', color: 'white' }} />
                {this.state.snaps.length ? null : <img style={{ width: 100 + 'vw', marginTop: 15 + 'vh' }} src='https://media1.tenor.com/images/d5d2b8703922df9d25da6aded6eaf2f3/tenor.gif' alt="Image No Snaps"/>}
                {this.state.snaps.map(snap => {
                  return <>
                    <div
                      onClick={e => this.showSnap(e)}
                      value={snap.snap_id}
                      style={{
                        height: 'auto',
                        paddingLeft: 5 + 'vw',
                        marginTop: 2 + 'vh',
                        marginBottom: 2 + 'vh',
                      }}
                    >&#128548; {snap.from}</div>
                    <hr style={{ marginBottom: 1 + 'vh', background: 'grey' }} />
                  </>
                })}

                <div
                  className="d-flex flex-row"
                  style={{
                    position: 'absolute',
                    bottom: 3 + 'vh',
                    right: 35 + 'vw',
                  }}
                >

                  <Logout />

                  <button style={{
                    borderRadius: 100 + '%',
                    width: 50 + 'px',
                    height: 50 + 'px',
                    marginRight: 5 + 'vw',
                  }}
                    onClick={this.local}
                    className="btn btn-success"
                  >&#128193;</button>

                  <button
                    className="btn btn-info"
                    style={{
                      borderRadius: 100 + '%',
                      width: 50 + 'px',
                      height: 50 + 'px',
                      // position: 'fixed',
                    }}
                    onClick={this.cam}
                  >&#128247;</button>


                </div>

              </div>
          :
          <>
            <button>{this.state.timeleft}</button>
            <img src={this.state.imagedata} />
          </>
        }
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Profile)