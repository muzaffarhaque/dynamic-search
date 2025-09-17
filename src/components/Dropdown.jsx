import React, { useState, useRef, useEffect } from "react";

export const Dropdown = ({ child,options=[],setTabs }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  
function toggleHandler(e) {
  const { checked, name } = e.target;

  const updatedList = options.map((opt) =>
    opt.name === name ? { ...opt, isChecked: checked } : opt
  );

  setTabs(updatedList);

}

  function toggleState() {
    setOpen(!open);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`dropdown_wrapper ${open ? "active" : ""}`}>
      <div className="drop_title" onClick={toggleState}>
        {child}
      </div>

      {open && (
        <ul className="dropdown_menu">
            {options?.map((ele,i)=>{
                if(ele?.name==="All") return null;
                return(
                     <li className={`option fs-16-13 ${ele?.isChecked ? '':'disable'}`} key={i}> 
                        <p className="name_icon fs-16-13">
                            {ele?.icon}
                            <span>{ele?.name}</span>
                        </p>
                        <input type="checkbox" name={ele?.name} id={`id_${i}`} onChange={toggleHandler} checked={ele?.isChecked}  className="toggle_input"/>
                        <label htmlFor={`id_${i}`} className="custom_toggle">
                            <span className="toggle_button"></span>
                        </label>
                    </li>
                 )
            })}
          {/* <li className="option fs-16-13">Option 2</li>
          <li className="option fs-16-13 disable">Option 3</li> */}
        </ul>
      )}
    </div>
  );
};
