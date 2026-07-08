import React from 'react'
import Header from '../../components/Tailor/header'
import TailorProfilePhoto from '../../components/Tailor/Profile/TailorProfilePhoto'
import HeritageSection from '../../components/Tailor/Profile/HeritageSection'
import PortfolioGallery from '../../components/Tailor/Profile/PortfolioGallery'
import TailorPhoneFooter from '../../components/Tailor/TailorPhoneFooter'

const Profile = () => {
  return (
    <div className="bg-theme-bg min-h-screen pb-24 w-full transition-colors duration-300">
      <Header/>
      <TailorProfilePhoto/>
      <HeritageSection/>
      <PortfolioGallery/>
      <TailorPhoneFooter/>
    </div>
  )
}

export default Profile
