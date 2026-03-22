import React from 'react'
import Header from '../../components/Tailor/header'
import TailorProfilePhoto from '../../components/Tailor/Profile/TailorProfilePhoto'
import HeritageSection from '../../components/Tailor/Profile/HeritageSection'
import PortfolioGallery from '../../components/Tailor/Profile/PortfolioGallery'

const Profile = () => {
  return (
    <div>
      <Header/>
      <TailorProfilePhoto/>
      <HeritageSection/>
      <PortfolioGallery/>
    </div>
  )
}

export default Profile
