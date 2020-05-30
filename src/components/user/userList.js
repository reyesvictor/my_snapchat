import React from 'react';
import { Provider } from 'react-redux'
import { Container, Input, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { BrowserRouter as Router } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import store from '../../store'
import { Button } from 'reactstrap'
import axios from 'axios'
import { toast } from 'react-toastify';

// import { loadUser } from '../actions/authActions'

class userList extends React.Component {

  state = {
    users: [],
    userResult: [],
    userSearch: '',
    seconds: 5
  }

  componentDidMount() {
    console.log(this.props)

    //get user list from API
    const config = {
      headers: {
        "token": this.props.auth.user.token
      }
    }

    axios.get('http://snapi.epitech.eu/all', config)
      .then(res => {
        this.setState({ users: res.data.data, userResult: res.data.data })
      })
  }

  onChange = async e => {
    await this.setState({ [e.target.name]: e.target.value })
    let userRes
    if (this.state.userSearch == '') {
      userRes = this.state.users
    } else {
      userRes = this.state.users.filter(user => user.email.match(this.state.userSearch))
    }
    this.setState({ userResult: userRes })
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  handleChange = (e) => {
    this.setState({
      seconds: !e.target.value
    })
  }

  onSend = (email) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "token": this.props.auth.user.token
      }
    }

    //Convertir image to send to API
    const body = new FormData();
    body.append('duration', this.state.seconds)
    body.append('to', email);
    if (typeof this.props.dataUri == 'string') {
      body.append('image', this.dataURLtoFile(this.props.dataUri, 'snap.jpg'))
    } else {
      body.append('image', this.props.dataUri)
    }

    console.log(this.props.dataUri)

    axios.post('http://snapi.epitech.eu/snap', body, config)
      .then(res => {
        toast.success(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  refreshPage = () => {
    window.location.reload(false);
  }

  render() {
    const users = this.props.users
    const { user, isAuthenticated, isLoading } = this.props.auth
    return (
      <>
        <div
          style={{
            background: '#282c34',
            color: '#e7eee0',
            fontSize: 2.5 + 'vh',
          }}>

          <div>
            <Label for="duration">Duration</Label>
            <select id="duration" className="selectpicker" onChange={this.handleChange}
              style={{
                width: 15 + 'vw',
                borderRadius: 1 + 'vw',
                marginLeft: 3 + 'vw',
              }}>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="15">15</option>
            </select>
          </div>
          <Label for="username">Find a user</Label>
          <Input
            type="text"
            name="userSearch"
            id="userSearch"
            placeholder="Send to..."
            onChange={this.onChange}
          />
          {this.state.userResult.map(({ email }) =>
            <>
              <hr key={email + 'hr'} />
              <Container
                value={email}
                onClick={e => this.onSend(e.target.innerHTML)}>{email}</Container>
            </>
          )}
        </div>
        <Button onClick={this.refreshPage}
          style={{
            position: 'fixed',
            bottom: 5,
            right: 45 + 'vw',
            opacity: 0.5
          }}
        >&times;</Button>{' '}
      </>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(userList)