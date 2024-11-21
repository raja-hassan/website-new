import React from 'react'
import './CustomHeader.scss'
import profile from '../../Assets/avatar.jpg'
import CustomProfile from '../CustomProfile/CustomProfile'

function CustomHeader(props) {
  return (
    <>
    <div className='header-wrap'>
        {/* <h1 className='fs-3'>{props.pagetitle}</h1>
        <CustomProfile profileimg={profile}/> */}
        {/* <img src={profile} alt="" className='profile-img'/> */}
    </div>
    </>
  )
}

export default CustomHeader