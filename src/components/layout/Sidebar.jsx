import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faFolder,
  faUsers,
  faExchangeAlt,
  faChevronDown,
  faChevronUp,
  faFile, faImages,
  faPowerOff,
  faCubes,
  faShoppingCart,
  faMessage,
  faCommentAlt,
  faComment,
  faMobile,
  faMobileAlt,
  faComments,
  faUser,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const menu = localStorage.getItem("level") === "owner" ? [
    {
      name: "Dashboard",
      icon: faTachometerAlt,
      path: "/app/dashboard",
    },
    {
      name: "User",
      icon: faUserCircle,
      path: "/app/user",
    },
    {
      name: "Device",
      icon: faMobileAlt,
      path: "/app/device",
    },
    {
      name: "WhatsApp Web",
      icon: faComments,
      path: "/app/chat",
    },
    {
      name: "Logout",
      icon: faPowerOff,
      path: "/app/logout",
    }
  ] : [
    {
      name: "Dashboard ",
      icon: faTachometerAlt,
      path: "/app/dashboard",
    },
    {
      name: "Device",
      icon: faMobileAlt,
      path: "/app/device",
    },
    {
      name: "WhatsApp Web",
      icon: faComments,
      path: "/app/chat",
    },
    {
      name: "Logout",
      icon: faPowerOff,
      path: "/app/logout",
    }
  ]

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };
  const closeSubmenu = () => {
    setOpenSubmenu(null);
    toggleSidebar();
  };

  return (
    <div
      className={`fixed bg-white text-gray-950 lg:static max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-900 shadow-lg h-full w-64 p-3 transform transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
    >
      <ul className="space-y-2">
        {menu.map((item, index) => (
          <li key={index}>
            {!item.submenu ? (
              <Link
                to={item.path}
                className={`flex items-center justify-between p-2 rounded-lg ${location.pathname === item.path
                    ? "bg-blue-700 text-white"
                    : "text-gray-950 hover:text-white hover:bg-blue-500"
                  }`}
                onClick={closeSubmenu}
              >
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <>
                <button
                  onClick={() => handleSubmenuToggle(index)}
                  className="flex items-center justify-between w-full p-2 rounded-lg text-gray-950 hover:bg-blue-500 hover:text-white"
                >
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={item.icon} />
                    <span>{item.name}</span>
                  </div>
                  <FontAwesomeIcon
                    icon={openSubmenu === index ? faChevronUp : faChevronDown}
                  />
                </button>
                {openSubmenu === index && (
                  <ul className="pl-8 mt-2 space-y-1">
                    {item.submenu.map((subitem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={subitem.path}
                          className={`block p-2 rounded-lg ${location.pathname === subitem.path
                              ? "bg-blue-700 text-white"
                              : "text-gray-950 hover:text-white hover:bg-blue-500"
                            }`}
                          onClick={() => toggleSidebar()}
                        >
                          {subitem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
