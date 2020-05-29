import React, { useState } from 'react'
import Camera from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import UserList from './user/userList'
import { Redirect, Route } from 'react-router-dom'
import Profile from './Profile'


import ImagePreview from './ImagePreview' // source code : ./src/demo/AppWithImagePreview/ImagePreview

function Cam(props) {
  const [dataUri, setDataUri] = useState('')
  const [camError, setCamError] = useState('')

  function handleTakePhotoAnimationDone(dataUri) {
    console.log('takePhoto')
    setDataUri(dataUri)
  }

  function handleCameraError(error) {
    setCamError(error)
    // console.log('This is my error handleCameraError', error)
  }

  const isFullscreen = false
  return (
    <div>
      {
        (dataUri)
          ?
          <>
            <div
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
              <ImagePreview dataUri={dataUri}
                isFullscreen={isFullscreen}
                isFullscreen={true}
              />
            </div>
            {/* Acces a l'image dans la UserList pour l'envoyer */}
            <UserList dataUri={dataUri} />
          </>
          :
          (camError)
            ?
            <Profile error={camError}/>
            :
            <Camera
              onCameraError={(error) => { return handleCameraError(error) }}
              onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
              isFullscreen={isFullscreen}
              isFullscreen={true}
            />
      }
    </div>
  )
}

export default Cam