import React, { Component } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert
} from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { register } from '../../actions/authActions'
import { clearErrors } from '../../actions/errorActions'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

class RegisterModal extends Component {
    state = {
        modal: false,
        email: '',
        password: '',
        msg: null,
        modalsuccess: 1,
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        registered: PropTypes.bool,
    }

    // once the component updates, it's gonna check for errors so it can display them
    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props

        if (error !== prevProps.error) {
            if (error.id === 'REGISTER_FAIL') {
                // in redux, you can see on the tree that it's MSG > MSG: "VALUE" that;s why it's double msg
                this.setState({ msg: error.msg })
            }
            else {
                this.setState({ msg: null })
            }
        }

        // if the modal is open , AKA this.state.modal is true, AND if the user is authenticated which means he has a token, then close the modal because the user successfully registered
        // console.log('ModalState',this.state.modal)
        if (this.state.modal) {
            // console.log(this.state.modal)
            // console.log(error, error.msg)
            if (isAuthenticated) {
                this.toggle()
            }
        }
    }   

    toggle = () => {
        this.props.clearErrors()
        this.setState({
            modal: !this.state.modal
        })
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = async e => {
        e.preventDefault()

        const { email, password } = this.state

        //creates the user from the form data
        const user = {
            email,
            password
        }

        // gonna try and register
        await this.props.register(user)

    }

    render() {
        // console.log(this.props, this.props.registered)
        if (this.props.registered && this.state.modalsuccess === 1 ) {
            let count = this.state.modalsuccess + 1
            this.setState({modalsuccess:  count})
            toast.success('You are now a member ! Please log in.')
        }
        return (
            <div>
                <ToastContainer />
                <NavLink
                    style={{
                        background: '#1b94f6',
                        color: 'white',
                        position:'fixed',
                        bottom: 0,
                        width: 100 + 'vw',
                        height: 15 + 'vh',
                        fontSize: 10 + 'vw',
                        lineHeight: 12 + 'vh', 
                        textAlign: 'center', 
                    }}
                    onClick={this.toggle} href="#">
                    SIGN UP
                </NavLink>
                <Modal isOpen={this.props.registered ? null : this.state.modal } toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Register!</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? <Alert> {this.state.msg}</Alert> : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Type email"
                                    onChange={this.onChange}
                                />
                                <Label for="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Type password"
                                    onChange={this.onChange}
                                />
                                <Button color="dark" className="mt-4" block>
                                    Register
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    registered: state.auth.registered,
})

export default connect(
    mapStateToProps,
    { register, clearErrors }
)(RegisterModal)