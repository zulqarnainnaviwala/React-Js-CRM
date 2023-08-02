import React, { useState } from "react";
import "../style.css";
import logo from "../assets/logo 1.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { reset, logout } from "../app/reducers/authSlice";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCustomersDropdownOpen, setIsCustomersDropdownOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleModeSwitch = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggleCustomersDropdown = () => {
    setIsCustomersDropdownOpen(!isCustomersDropdownOpen);
  };

   const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };
  

  return (
             
          




    <div className={`sidebar ${isSidebarOpen ? "close" : ""} ${isDarkMode ? "dark" : ""}`}>
      <header>
        <div className="image-text">
          <span className="image">
            <img src={logo} alt="" />
          </span>

          <div className="text logo-text">
            <span className="name">Rise Business Solution</span>
            <span className="profession">Super Admin</span>
          </div>
        </div>

        <i
          className="bx bx-chevron-right toggle"
          onClick={handleToggleSidebar}
        ></i>
      </header>

      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links">
            <li className="nav-link">
              <Link to="/dashboard">
                <i className="bx bx-home-alt icon"></i>
                <span className="text nav-text">Dashboard</span>
              </Link>
            </li>

            <li className="nav-link">
              <div className="nav-dropdown">
                <div
                  className="nav-link-with-dropdown"
                  onClick={handleToggleCustomersDropdown}
                >
                  <i className="bx bx-bar-chart-alt-2 icon"></i>
                  <span className="text nav-text txt">Customers</span>
                  <i
                    className={`bx ${
                      isCustomersDropdownOpen
                        ? "bx-chevron-up"
                        : "bx-chevron-down"
                    }`}
                  ></i>
          
                </div>
              </div>
            </li>
                  <li>
                  <Link to ="/customers">
                <i className="bx bx-user icon"></i>
                <span className="text nav-text">Customer List</span>
              </Link>                  
              </li>
                  <li>
                  <Link to ="/addcustomers">
                <i className="bx bx-store icon"></i>
                <span className="text nav-text">Add Customers</span>
              </Link>            
                  </li>
                  {/* Add more dropdown items as needed */}
            <li className="nav-link">
              <Link to ="/UploadCSV">
              <i class='bx bxs-file-doc icon'></i>                <span className="text nav-text">Upload File</span>
              </Link>
            </li>
            {/* <li className="nav-link">
              <Link to="#">
                <i className="bx bx-home-alt icon"></i>
                <span className="text nav-text">Notification</span>
              </Link>
            </li>
            <li className="nav-link">
              <Link to="#">
                <i className="bx bx-home-alt icon"></i>
                <span className="text nav-text">Notification</span>
              </Link>
            </li>
            <li className="nav-link">
              <Link to="#">
                <i className="bx bx-home-alt icon"></i>
                <span className="text nav-text">Notification</span>
              </Link>
            </li> */}

            {/* Other menu items... */}
          </ul>
        </div>

        <div className="bottom-content">
        {/* {user ? (
              <>
              
                   <li>
            <button className="btn-2" onClick={handleLogout}>
              <i className="bx bx-log-out icon"></i>
              <span className="text nav-text "  >Logout</span>
            </button>
          </li>
              </>
            ) : (
              <>
              
               
              </>
            )} */}

       
              
            
               
        

          <li className="mode" onClick={handleModeSwitch}>
            <div className="sun-moon">
              <i
                className={`bx ${isDarkMode ? "bx-moon" : "bx-sun"} icon`}
              ></i>
            </div>
            <span className="mode-text text">
              {isDarkMode ? "Light mode" : "Dark mode"}
            </span>

            <div className="toggle-switch">
              <span className={`switch ${isDarkMode ? "dark" : ""}`}></span>
            </div>
          </li>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;