import React from 'react'
import PropTypes from 'prop-types'
import Camera from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import { connect } from 'react-redux'
import 'react-toastify/dist/ReactToastify.min.css'
import UserList from './userList'
import ImagePreview from '../ImagePreview'

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
        console.log(this.state.file)
    }

    getDataUrl = (files) => {
        // // Create canvas
        // const canvas = document.createElement('canvas')
        // const ctx = canvas.getContext('2d')
        // // Set width and height
        // canvas.width = img.width
        // canvas.height = img.height
        // // Draw the image
        // ctx.drawImage(img, 0, 0)
        // return canvas.toDataURL('image/jpeg')
        var reader = new FileReader()
        reader.onload = function (event) {
            var img = new Image()
            img.onload = function () {
                // return img.currentSrc 
                // // console.log(img.currentSrc)
                document.getElementById('image-preview').appendChild(img)
            }
            img.src = event.target.result
        }
        reader.readAsDataURL(files)
    }

    // Select the image
    // const img = document.querySelector('#my-image')
    // img.addEventListener('load', function (event) {
    //     const dataUrl = getDataUrl(event.currentTarget)
    //     console.log(dataUrl)
    // })

    render() {
        const { user, isAuthenticated, isLoading } = this.props.auth
        return (
            <>
                {
                    (this.state.file)
                        ?
                        <>
                            <div
                                id="image-preview"
                                style={{
                                    margin: 'auto',
                                    width: 100 + 'vw',
                                    overflowY: 'scroll',
                                    border: '1px solid grey',
                                    float: 'left',
                                    height: '500px',
                                    position: 'relative'
                                }}
                            >
                                <ImagePreview dataUri={this.getDataUrl(this.state.file)}
                                // isFullscreen={isFullscreen}
                                // isFullscreen={true}
                                />
                            </div>
                            <UserList dataUri={this.state.file} />
                        </>
                        :
                        <input id="my-file-selector" type="file" name="file" onChange={this.onFileChange}></input>
                }
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PickFile)