import React from 'react';
import { Provider } from 'react-redux'
import { Container, Input, Label } from 'reactstrap'
import { BrowserRouter as Router } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import store from '../../store'
import Axios from 'axios';
import axios from 'axios'

// import { loadUser } from '../actions/authActions'

class userList extends React.Component {

  state = {
    users: [],
    userResult: [],
    userSearch: ''
  }

  componentDidMount() {
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

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
    let userRes = this.state.users.filter(user => user.email.match(this.state.userSearch))
    this.setState({ userResult: userRes })
  }

  static propTypes = {
    auth: PropTypes.object.isRequired
  }

  render() {
    const users = this.props.users
    const { user, isAuthenticated, isLoading } = this.props.auth
    return (
      <>

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
            <Container key={email + 'div'} onClick={null}>{email}</Container>
          </>
        )}
      </>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(userList)