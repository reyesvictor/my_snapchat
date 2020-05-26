import React from 'react';
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/authActions'
import { Container } from 'reactstrap'
import LoginForm from './components/auth/loginForm'
// import IndexNavbar from './components/IndexNavbar'
import { BrowserRouter as Router, Route } from 'react-router-dom'

class App extends React.Component {

  componentDidMount() {
    store.dispatch(loadUser())
  }

  render() {
    return (
      <Router>
        <Provider store={store}>
          {/* <IndexNavbar /> */}
          <Container>
            <LoginForm />
            {/* <Route path="/:id/:postid" exact component={PostDetail} />
            <Route path="/search/user/posts/" exact component={SearchPost} />
            <Route path="/:id" exact component={UserPosts} />
            <Route path="/" exact component={UserList} /> */}
          </Container>
        </Provider>
      </Router>
    )
  }
}

export default App;