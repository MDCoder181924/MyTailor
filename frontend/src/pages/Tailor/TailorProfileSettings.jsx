import React from 'react'
import TailotSetting from "../../components/Tailor/Setting/TailorSetting"
import TailorPhoneFooter from '../../components/Tailor/TailorPhoneFooter'

const TailorProfileSettings = () => {
  return (
    <div className="pb-24 bg-theme-bg min-h-screen transition-colors duration-300">
      <TailotSetting/>
      <TailorPhoneFooter/>
    </div>
  )
}

export default TailorProfileSettings
