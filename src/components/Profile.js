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
    snaps: [],
    snap_showing: false,
    imagedata: '',
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
    const config = {
      headers: {
        'Content-Type': 'application/octet-stream',
        "token": this.props.auth.user.token
      }
    }


    const duration = this.state.snaps.filter(snap => snap.snap_id == snap_id)[0].duration
    console.log('duration', duration)

    axios.get(`http://snapi.epitech.eu/snap/${snap_id}`, config)
    // .then((response) => response.data.blob())
    .then((res) => {

      const url = window.URL.createObjectURL(new Blob([res.data]));
      this.setState({imagedata:url })
      // console.log(url)
      // document.getElementById('img').src = url;


        // var nuroImage = new Image;
        // var request = new XMLHttpRequest();
        // request.responseType = "blob";
        // request.onload = function () {
        //   nuroImage.src = URL.createObjectURL(res.data)
        // }
        // request.open("GET", "/path/to/image/file");
        // request.send();


        //afficher l'image
        //    <img ng-src="data:image/*;base64,{{Raw Binary Data}}"/>

        this.setState({ snap_showing: true })
        const timer = setTimeout(() => {
          console.log('This will run after 1 second!')
          this.setState({ snap_showing: false, imagedata: res.data })
        }, duration * 1000);
        return () => clearTimeout(timer);
      })
      .catch(async err => {
        //disconnect user
        // dispatch()
        toast.error('Error getting this snap')
        console.log(err)
        // await this.setState({ snap_showing: false })
      })
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
        console.log(res)
        toast.success(res.data.data)
      })
      .catch(err => {
        toast.error('didnt mark as seen')
        console.log(err)
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
          <img src={this.state.imagedata} />
        }
      </>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Profile)