import React, { useEffect, useState } from 'react'
import commonGetApi from '../server/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faArrowUpRightFromSquare, faFile, faFolder, faL, faLink, faListUl, faMagnifyingGlass, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faUser,faComment } from "@fortawesome/free-regular-svg-icons";  // Regular style
import { faPaperclip, faCog } from "@fortawesome/free-solid-svg-icons"; // Solid style (no regular version)
import userProfile from "../assets/images/user.jfif";
import { Dropdown } from '../components/Dropdown';
import { groupBy } from '../utils/reusableFunction';
import useCountAnimation from '../hooks/useCountAnimation';



export default function Home() {
  const [searchData,setSearchData]=useState([]);
    const [tabs, setTabs] = useState([
    { name: "All", icon: "", count: searchData?.length, isChecked: true },
    { name: "File", icon: <FontAwesomeIcon icon={faPaperclip} />, count: 0, isChecked: true },
    { name: "People", icon: <FontAwesomeIcon icon={faUser} />, count: 0, isChecked: true },
    { name: "Chat", icon: <FontAwesomeIcon icon={faComment} />, count: 0, isChecked: false },
    { name: "List", icon: <FontAwesomeIcon icon={faListUl} />, count: 0, isChecked: false },
    // { name: "PDF", icon: <FontAwesomeIcon icon={faListUl} />, count: 0, isChecked: false },
  ]);
  const [loading,setLoading] = useState(false);
  const [searchTerm,setSearchTerm]=useState('');
  const [data,setData]=useState([]);

  const [selectedTab,setSelectedTab]=useState(0);
  async function getData(){
    try{
    setLoading(true)
    const res=await commonGetApi('https://raw.githubusercontent.com/muzaffarhaque/dynamic-search-data/refs/heads/main/mixdata.json');
    // await new Promise((resolve) => setTimeout(resolve, 2500));
    if(res.status===200){
      console.log(res)
      setData(res.data)
    }
    }
    catch(err){
      console.log(err)
    }
    finally{
      setLoading(false)
    }

  }
  useEffect(()=>{
   getData()
  },[])

 const HighlightText = (text, highlight) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} style={{ backgroundColor: "#ffa5005e" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  function updatedOptionsHandler(updatedOptions){
    const selectedIndex=updatedOptions.findIndex((ele)=>ele?.isChecked)
    setSelectedTab(selectedIndex)
    setTabs(updatedOptions);
  }

  // 🔹 Debounce logic here
  useEffect(() => {
    if (!searchTerm) {
      setLoading(false);
      setTabs((prevTabs) =>
          prevTabs.map((tab) => ({ ...tab, count: 0 })) 
      );
      // setSearchData(data);
      return;
    }

    setLoading(true);
    const handler = setTimeout(() => {
      // const filteredData = data?.filter((item) => {
      //   return Object.values(item).some(
      //     (val) =>
      //       typeof val === "string" &&
      //       val.toLowerCase().includes(searchTerm.toLowerCase())
      //   );
      // });
         const filteredData = data?.filter((item) => {
        return  item?.name.toLowerCase().includes(searchTerm.toLowerCase());
      });


      setSearchData(filteredData);
      setSelectedTab(0);

      const grouped =groupBy(filteredData, "type");
      const typeObj = { File: "file", People: "user", Chat: "video", List: "folder",PDF:'file' };
      console.log(grouped, "grouped");
     setTabs((prevTabs) =>
       prevTabs.map((tab) => {
         let count = 0;

         if (tab.name === "All") {
           count = filteredData?.length;
         } else if (tab.name === "File") {
           // File count = file + pdf
           const fileCount = grouped["file"] ? grouped["file"].length : 0;
           const pdfCount = grouped["pdf"] ? grouped["pdf"].length : 0;
           count = fileCount + pdfCount;
         } else {
           const mappedType = typeObj[tab.name];
           count = grouped[mappedType] ? grouped[mappedType].length : 0;
         }

         return { ...tab, count };
       })
     );


      setLoading(false);
    }, 500); // wait 500ms after last key stroke

    return () => clearTimeout(handler); // cleanup old timer
  }, [searchTerm, data]);
  

    const animatedTabs = tabs.map((tab) => ({
    ...tab,
    animatedCount: useCountAnimation(tab.count, 800),
  }));


  const listIcons ={
    'file':<FontAwesomeIcon icon={faFile} />,
    'pdf':<FontAwesomeIcon icon={faFile} />,
    'folder':<FontAwesomeIcon icon={faFolder} />,
    'video' :<FontAwesomeIcon icon={faPlay} />
  }
  return (
    <section className="main-home-section">
      <div className="search_card_box">
        <div className="search_header_frame">
          {!loading ? (
            <div className="search-icon">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>

          ) : (
            <span className="search_loader"></span>
          )}

          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Searching is easier" />
          <p className="clear_text" onClick={()=>setSearchTerm("")}>Clear</p>
        </div>
        {searchTerm && <>
        <div className="parent_tab_wrapper">
          <div className="tab_sub_header">
            {animatedTabs?.map((ele, i) => {
              if (!ele?.isChecked) return null;
               
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
                   <span className="count">{ele.animatedCount}</span>
                </div>
              );
            })}
            {/* <div className="tab fs-16-13">All <span className='count'>3</span></div>
                <div className="tab fs-16-13"><FontAwesomeIcon icon={faPaperclip} /> Files <span className='count'>2</span></div>
                <div className="tab fs-16-13"><FontAwesomeIcon icon={faUser} /> People <span className='count'>3</span></div>
                <div className="tab fs-16-13"><FontAwesomeIcon icon={faComment} /> Chat <span className='count'>3</span></div> */}
          </div>
          <div className="setting_dropdown">
            <Dropdown
              child={
                <FontAwesomeIcon
                  icon={faCog}
                  className={`gray-828 setting_icon  ${selectedTab ? "" : ""}`}
                />
              }
              options={tabs}
              setTabs={setTabs}
              updatedOptionsHandler={updatedOptionsHandler}
            />
          </div>
        </div>

        <div className="search_body_section">
          <ul>
            {!loading ? (
              searchData && searchData?.length > 0 ? (
                searchData?.map((item, index) => {
                  return (
                    <li key={index}>
                      <div className="user_details">
                        {item?.type !=="user" ?
                         <div className="profile_logo">
                         {listIcons[item?.type] }
                         </div>
                         :
                        <div className="image_profile_frame">
                          <img src={item.avatar || userProfile} alt="" />
                          <span className="dotes"></span>
                        </div>
                        }
                        <div className="description_paragraph">
                          <h5 className="fs-16-13">
                            {HighlightText(item?.name, searchTerm)}
                          </h5>
                          <p className="fs-14-12">{ item?.edited || 'Active 1 w ago'}</p>
                        </div>
                      </div>
                      <div className="action_button_frame">
                        <div className="link_icon">
                          <FontAwesomeIcon icon={faLink} />
                        </div>
                        <div className="new_tab fs-14-12">
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />{" "}
                          New tab
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="no-data">No data found</li>
              )
            ) : (
              [...Array(6)].map((_, index) => {
                return <LazyLoad key={index} />;
              })
            )}
          </ul>
        </div>
        </>}
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