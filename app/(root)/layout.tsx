import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import React from 'react'

const RootLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='root'>
      {/* Sidebar  */}
      <Sidebar/>
      {/* MobileNav  */}
      <MobileNav/>
        <div className='root-container'>
            <div className='wrapper'>
                {children}
            </div>
        </div>
    </div>
  )
}

export default RootLayout