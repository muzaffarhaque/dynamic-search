import React, { useEffect, useState } from 'react'
import commonGetApi from '../server/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faArrowUpRightFromSquare, faL, faLink, faListUl, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser,faComment } from "@fortawesome/free-regular-svg-icons";  // Regular style
import { faPaperclip, faCog } from "@fortawesome/free-solid-svg-icons"; // Solid style (no regular version)
import userProfile from "../assets/images/user.jfif";
import { Dropdown } from '../components/Dropdown';


export default function Home() {
    const [tabs, setTabs] = useState([
    { name: "All", icon: "", count: 3, isChecked: true },
    { name: "File", icon: <FontAwesomeIcon icon={faPaperclip} />, count: 4, isChecked: true },
    { name: "People", icon: <FontAwesomeIcon icon={faUser} />, count: 5, isChecked: true },
    { name: "Chat", icon: <FontAwesomeIcon icon={faComment} />, count: 2, isChecked: false },
    { name: "List", icon: <FontAwesomeIcon icon={faListUl} />, count: 2, isChecked: false },
  ]);

  const [data,setData]=useState([]);
  const [selectedTab,setSelectedTab]=useState(0);
  async function getData(){
    const data=await commonGetApi('https://randomuser.me/api/?page=1&results=1');
    console.log(data)
    setData(data.data)
  }
  useEffect(()=>{
   getData()
  },[])


  function updatedOptionsHandler(updatedOptions){
    const selectedIndex=updatedOptions.findIndex((ele)=>ele?.isChecked)
    setSelectedTab(selectedIndex)
    setTabs(updatedOptions);
  }
  return (
    <section className="main-home-section">
      <div className="search_card_box">
        <div className="search_header_frame">
          {false ? (
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          ) : (
            <span className="search_loader"></span>
          )}

          <input type="text" placeholder="Searching is easier"  />
          <p className="clear_text">Clear</p>
        </div>

        <div className="parent_tab_wrapper">
          <div className="tab_sub_header">
            {tabs?.map((ele, i) => {
              if(!ele?.isChecked) return null;
              return (
                <div
                  className={`tab fs-16-13 ${
                    i == selectedTab ? "selected" : ""
                  }`}
                  onClick={() => setSelectedTab(i)}
                  key={i}
                >
                  {" "}
                  {ele.icon} {ele?.name}{" "}
                  <span className="count">{ele?.count}</span>
                </div>
              );
            })}
            {/* <div className="tab fs-16-13">All <span className='count'>3</span></div>
                <div className="tab fs-16-13"><FontAwesomeIcon icon={faPaperclip} /> Files <span className='count'>2</span></div>
                <div className="tab fs-16-13"><FontAwesomeIcon icon={faUser} /> People <span className='count'>3</span></div>
                <div className="tab fs-16-13"><FontAwesomeIcon icon={faComment} /> Chat <span className='count'>3</span></div> */}
          </div>
          <div className="setting_dropdown">
            <Dropdown child={ <FontAwesomeIcon icon={faCog} className={`gray-828 setting_icon  ${selectedTab ? "":''}`}  />} options={tabs} setTabs={setTabs} updatedOptionsHandler={updatedOptionsHandler}/>
          </div>
        </div>

        <div className="search_body_section">
          <ul>
            {[...Array(6)].map((_, index) => {
              return (
                // <LazyLoad key={index}/>
                <li>
                  <div className="user_details">
                  <div className="image_profile_frame">
                    <img src={userProfile} alt="" />
                    <span className="dotes"></span>
                  </div>
                  <div className="description_paragraph">
                    <h5 className="fs-16-13">Danial Richear</h5>
                    <p className="fs-14-12">Active 1 w ago</p>
                  </div>
                  </div>
                  <div className="action_button_frame">
                    <div className="link_icon"><FontAwesomeIcon icon={faLink} /></div>
                    <div className="new_tab fs-14-12"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> New tab</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}


function LazyLoad() {
  return (
    <li className="lazy-load">
      <div className="image_profile_frame"></div>
      <div className="description_paragraph">
        <h5 className="fs-16-13"></h5>
        <p className="fs-14-12"></p>
      </div>
    </li>
  );
}