import React, { useState } from "react";
import DownArrow from "../../assets/button-icons/svg/dropdown-arrow-down.svg";

interface DropdownProps {
  options: string[];
  defaultOption: string;
  handleSelect: (selected: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  defaultOption,
  handleSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);


  const handleOptionClick = (option: string) => {
    if (selectedOption === option) {
      setIsOpen(false);
      return;
    }
    setSelectedOption(option);
    setIsOpen(false);
    handleSelect(option);
  };

  return (
    <div className="dropdown">
      <button className={`dropdown-btn ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        {selectedOption}
          <img src={DownArrow} alt="down arrow" className={`dropdown-arrow ${isOpen ? "open" : ""}`}/>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
