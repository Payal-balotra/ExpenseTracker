import React, { useState } from 'react'
import SideMenu from './SideMenu'
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi"

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className='flex gap-5 bg-white/5 border-b border-white/10 backdrop-blur-md py-4 px-7 sticky top-0 z-30 ml-0 md:ml-0'>
      <button className='block lg:hidden text-white' onClick={() => { setOpenSideMenu(!openSideMenu) }}>
        {openSideMenu ? (<HiOutlineX className="text-2xl" />)
          :
          (<HiOutlineMenu className="text-2xl" />)}

      </button>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white">W</div>
        <h2 className='text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent'>WalletIQ</h2>
      </div>
      
      {/* Mobile Menu */}
      {openSideMenu && (
        <div className='fixed top-[61px] left-0 right-0 bottom-0 bg-black/90 backdrop-blur-xl z-50 p-6 lg:hidden'>
          <SideMenu activeMenu={activeMenu} isMobile={true} />
        </div>
      )}
    </div>
  )
}

export default Navbar