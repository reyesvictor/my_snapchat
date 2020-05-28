import React, { Component, Fragment } from 'react'
import { logout } from '../../actions/authActions'
import { connect } from 'react-redux'
import { NavLink } from 'reactstrap'
import PropTypes from 'prop-types'

export class Logout extends Component {
    
    static propTypes = {
        logout: PropTypes.func.isRequired
    }
    
    //CSS TIME


    render() {
        return (
            <Fragment key="logoutmodal">
                <NavLink onClick={this.props.logout} href="#">
                    Logout
                </NavLink>
            </Fragment>
        )
    }
}


export default connect(
    null,
    { logout }
)(Logout);