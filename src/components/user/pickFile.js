import React from 'react'
import PropTypes from 'prop-types'
import Camera from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import { connect } from 'react-redux'
import 'react-toastify/dist/ReactToastify.min.css'
import UserList from './userList'
import ImagePreview from '../ImagePreview'
import { Button } from 'reactstrap'
import { Content } from 'rsuite'


class PickFile extends React.Component {

    state = {
        file: ''
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    onFileChange = async (e) => {
        await this.setState({
            file: e.target.files[0]
        })
        // console.log(this.state.file)
    }

    getDataUrl = (files) => {
        let reader = new FileReader()
        reader.onload = function (event) {
            let img = new Image()
            img.setAttribute("style", "width: 100vw;")
            img.onload = function () {
                document.getElementById('image-preview').appendChild(img)
            }
            img.src = event.target.result
        }
        reader.readAsDataURL(files)
    }

    refreshPage = () => {
        window.location.reload(false);
    }

    render() {
        const { user, isAuthenticated, isLoading } = this.props.auth
        return (
            <>
                <div
                    style={{
                        top: 0,
                        background: '#282c34',
                        height: 100 + 'vh',
                        width: 100 + 'vw',
                        color: '#e7eee0',
                        fontSize: 2.5 + 'vh',
                    }}>

                    {
                        (this.state.file)
                            ?
                            <>
                                <div
                                    id="image-preview"
                                    style={{
                                        margin: 'auto',
                                        // width: 100 + 'vw',
                                        height: 'fit-content',
                                        maxHeight: 80 + 'vw',
                                        overflowY: 'scroll',
                                        border: '1px solid grey',
                                        float: 'left',
                                        height: '500px',
                                        position: 'relative'
                                    }}
                                >
                                    <ImagePreview dataUri={this.getDataUrl(this.state.file)} />
                                </div>
                                <UserList dataUri={this.state.file} />
                            </>
                            :
                            <>
                                <input id="my-file-selector" type="file" name="file" onChange={this.onFileChange}
                                    style={{
                                        position: 'fixed',
                                        top: 44 + 'vh',
                                        left: 11 + 'vw',
                                        background: 'beige',
                                        color: 'black',
                                        display: 'block',
                                        margin: 'auto',
                                    }}
                                    className="btn btn-info"
                                ></input>
                            </>
                    }
                    {/* <Button onClick={this.refreshPage}
                        style={{
                            position: 'fixed',
                            bottom: 5,
                            right: 45 + 'vw',
                            opacity: 0.5
                        }}
                    >&times;</Button> */}
                </div>

            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PickFile)