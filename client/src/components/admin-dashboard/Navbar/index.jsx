import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import { FaHome, FaBell, FaCog, FaChevronDown, FaSearch, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa'; // Import dark/light mode icons
import { useStore } from '../../../store';
const Navbar = () => {
  const { setOpenSidenav } = useStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { activeRoute, isDarkMode, toggleDarkMode } = useStore(); // Access theme state and toggle function

  const notifications = [
    { id: 1, message: 'New message from John', time: '5 minutes ago' },
    { id: 2, message: 'Your report is ready', time: '1 hour ago' },
    { id: 3, message: 'Meeting in 30 minutes', time: '25 minutes ago' },
  ];

  return (
    <nav className={``}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center">
            <span className="logo "></span>
          </div>

          <div className="flex flex-row justify-between items-center w-full">
            <div className={`${isDarkMode ? ' text-white ' : ''} py-2 px-4`}>
              <div className="max-w-7xl mx-auto flex items-end opacity-70 space-x-2 text-sm">
                <FaHome className="h-4 w-4" />
                <span className="mx-1">/</span>
                <span className='font-semibold capitalize'>{activeRoute ? activeRoute : "Dashboard"}</span>
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className={`${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
                    } pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <FaSearch className="h-7 w-5 text-gray-500 absolute left-3 top-2.5" />
              </div>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="ml-3 p-1 rounded-full text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaBell className="h-6 w-4" />
              </button>
              <Link
                to="/admin-dashboard/settings"
                className="ml-3 p-1 rounded-full text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaCog className="h-6 w-4" />
              </Link>
              {/* Theme Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className="ml-3 p-1 rounded-full focus:outline-none"
              >
                {isDarkMode ? <FaSun className="h-6 w-4 text-yellow-400" /> : <FaMoon className="h-6 w-4 text-gray-600" />}
              </button>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setOpenSidenav(true)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {<FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>


      {/* Notification Dropdown */}
      <Transition
        show={isNotificationsOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'
            } absolute right-0 mt-2 w-80 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="notifications-menu"
        >
          <div className="py-1" role="none">
            {notifications.map((notification) => (
              <a
                key={notification.id}
                href="#"
                className={`block px-4 py-2 text-sm text-gray-700 ${isDarkMode ? 'text-white' : ''} hover:bg-gray-100 hover:text-gray-900`}
                role="menuitem"
              >
                <p className="font-medium">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </a>
            ))}
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;
