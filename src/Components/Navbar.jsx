import React, { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.png'
import menu from '../assets/icons/menue.png'
import close from '../assets/icons/close.png'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { NavbarData } from '../../data'
import RegistrationBtns from './RegistrationBtns'
import { useAuth } from '../Auth/AuthProvider'

const Navbar = () => {

  const { user, logOut, userRole } = useAuth() // Destructure user and userRole from useAuth
  const navigate = useNavigate()
  const location = useLocation()

  // Determine the displayed username
  const displayedUsername = user?.firstName || user?.userName || 'User';
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const handleLogout = () => {
    setIsDropdownOpen(false) // Close dropdown on logout
    logOut()
    navigate('/')
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false); // Close dropdown when profile link is clicked
    if (userRole === 'Doctor') {
      navigate('/doctor/profile'); // Navigate to DoctorProfile
    } else if (userRole === 'Patient') {
      navigate('/patient-profile'); // Navigate to PatientProfile
    } else {
      // Fallback or handle cases where role is not set/recognized
      navigate('/login'); 
    }
  };

  // Function to render conditional registration buttons with smooth transition
  const renderRegistrationButtons = (gap, className) => {
    const currentPath = location.pathname;
    
    if (currentPath === '/signup' || currentPath === '/signUp') {
      // Show only Login button on signup page
      return (
        <div className={`flex ${gap} transition-all duration-300 ease-in-out`}>
          <Link 
            to="/login" 
            className={`${className} border-2 border-Primary text-Primary rounded-lg hover:bg-Primary hover:text-white transition-all duration-200`}
          >
            Log in
          </Link>
        </div>
      );
    } else if (currentPath === '/login') {
      // Show only Sign UP button on login page
      return (
        <div className={`flex ${gap} transition-all duration-300 ease-in-out`}>
          <Link 
            to="/signup" 
            className={`${className} bg-Primary text-white rounded-lg hover:bg-Primary-dark transition-all duration-200`}
          >
            Sign UP
          </Link>
        </div>
      );
    } else {
      // Show both buttons on other pages (default behavior)
      return (
        <div className="transition-all duration-300 ease-in-out">
          <RegistrationBtns gap={gap} className={className} />
        </div>
      );
    }
  };

  const [toggle, setToggle] = useState(false)
  const [showmenuIcon, setshowmenuIcon] = useState(false) // Initial check for screen size
  const sidebarRef = useRef(null)


  const handleClickOutside = (event) => {
    if (toggle && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setToggle(false)
    }
  }

  useEffect(() => {
    const handleSize = () => {
      if (window.innerWidth <= 1024) {
        setshowmenuIcon(true)

      } else {
        setshowmenuIcon(false)
        setToggle(false)

      }
    }
    handleSize() // Initial check
    window.addEventListener('resize', handleSize)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('resize', handleSize)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [toggle, showmenuIcon])


  return (
    <section className='' >
      {

        // small screen
        showmenuIcon ? (
          <div className=' fixed top-0 w-full z-20 bg-white py-4 px-3 flex justify-between items-center shadow-lg  border-b-[3px] border-opacity-20 border-Secondary-darkGray'>
            <div className='flex items-center gap-2'>
              <img className='cursor-pointer' onClick={() => setToggle(!toggle)} width={24} height={24} src={menu} />
              <Link to="/">
                <img width={71} height={36} src={logo} />
              </Link>
            </div>


            <div className='relative'>
              {
                user ? (

                  <button onClick={toggleDropdown} className=' cursor-pointer flex items-center gap-2    px-4 py-2'>
                    <svg className='fill-Primary mb-2' width={20} height={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" /></svg>
                    <p className='text-[14px] font-semibold capitalize'>
                      {displayedUsername}
                    </p>
                    <p className='font-bold bg-Primary px-[10px] py-1 text-white rounded-full shadow-xl'>
                      {(displayedUsername || 'U').charAt(0).toUpperCase()}
                    </p>
                  </button>



                ) : (
                  renderRegistrationButtons('gap-1', 'px-3 py-1 text-[12px] font-[500]')
                )
              }

              <div>
                {
                  isDropdownOpen &&
                  <div className='z-30 absolute top-[66px] bg-white w-full cursor-pointer  border-2  text-center'>
                    <button onClick={handleProfileClick} className='block w-full text-black-medium font-semibold py-2 text-[15px] hover:bg-gray-100'>Profile</button>
                    <button onClick={handleLogout} className='block w-full text-black-medium font-semibold py-2  text-[15px] hover:bg-gray-100'>Logout</button>
                  </div>
                }
              </div>

            </div>

          </div>


          // large screen
        ) : (

          <div className=' bg-white px-20 py-2 flex  items-center justify-between border-b-[3px] border-opacity-20 border-Secondary-darkGray '>
            <Link to="/">
              <img src={logo} width={120} height={60} />
            </Link>
            <div className='flex items-center gap-14' >
              {
                NavbarData.map((item) => (
                  <div className=''>
                    <NavLink className={({ isActive }) =>
                      isActive ? 'text-Primary font-[600] text-lg' : ' text-Secondary-mediumGray text-lg hover:text-Primary hover:font-[500]'
                    } to={item.path}>{item.name}</NavLink>
                  </div>
                ))
              }
            </div>

            <div className='relative'>
              {
                user ? (

                  <button onClick={toggleDropdown} className=' cursor-pointer flex items-center gap-3    px-4 py-2'>
                    <svg className='fill-Primary mb-2' width={25} height={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" /></svg>
                    <p className='text-[14px] font-semibold capitalize'>
                      {displayedUsername}
                    </p>
                    <p className='font-bold bg-Primary px-3 py-2 text-white rounded-full shadow-xl'>
                      {(displayedUsername || 'U').charAt(0).toUpperCase()}
                    </p>
                  </button>



                ) : (
                  renderRegistrationButtons('gap-5', 'px-8 py-2 text-[17px] font-[600]')
                )
              }

              <div>
                {
                  isDropdownOpen &&
                  <div className='z-30 absolute top-[66px] bg-white w-full cursor-pointer  border-2  text-center'>
                    <button onClick={handleProfileClick} className='block w-full text-black-medium font-semibold py-2 text-[15px] hover:bg-gray-100'>Profile</button>
                    <button onClick={handleLogout} className='block w-full text-black-medium font-semibold py-2  text-[15px] hover:bg-gray-100'>Logout</button>
                  </div>
                }
              </div>

            </div>




          </div>
        )
      }



      {/* SideBar */}
      <div ref={sidebarRef}>
        <div className={`sidebar ${toggle ? "open" : "close"} `}>
          <div className="p-10 pt-24">

            <ul>
              {NavbarData.map((item, index) => (
                <div key={item.name} className="flex justify-center  mt-10">

                  <li className=' m-auto'>
                    <NavLink className={({ isActive }) => isActive ? 'text-Primary text-lg font-bold' : ' text-Secondary-mediumGray  hover:text-Primary hover:font-bold text-lg'} to={item.path} onClick={() => setToggle(false)}>
                      {item.name}
                    </NavLink>
                  </li>
                </div>
              ))}
            </ul>


          </div>
          {/* close */}
          <img onClick={() => setToggle(false)} className='m-auto cursor-pointer' src={close} />
        </div>
      </div>
    </section >
  )
}

export default Navbar


