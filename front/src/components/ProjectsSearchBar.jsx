import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { Search } from "react-bootstrap-icons";
import { Sliders, CheckCircleFill, Circle } from "react-bootstrap-icons";
import { createPopper } from "@popperjs/core";
import { getSearchByProjectName } from "../services/get";
import { StateContext } from "../utils/StateContext";
import styles from "../styles/SearchBar.module.css";
import { useTheme } from "../utils/ThemeContext";
import OutsideClickHandler from 'react-outside-click-handler';

function ProjectsSearchBar() {
  const [smShow, setSmShow] = useState(false);
  const [checked, setChecked] = useState({ projectName: false, status: false });
  const [value, setValue] = useState("");
  const { setProjects } = useContext(StateContext);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debounceSearch = useCallback(
    debounce(async (searchValue, includeStatus) => {
      const result = await getSearchByProjectName(searchValue, includeStatus);
      setProjects(result.data.projects);
    }, 400),
    []
  );

  const handleSearchChange = (e) => {
    setValue(e.target.value);
    debounceSearch(e.target.value, checked.status);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await getSearchByProjectName(value, checked.status);
    setProjects(result.data.projects);
  };

  const buttonRef = useRef(null);

const handleCheck = (name) => {
  setChecked((prevState) => {
    const newState = { projectName: false, status: false };
    newState[name] = !prevState[name];
    return newState;
  });
  setSmShow(false);

  debounceSearch(value, name === "status" ? !checked.status : false);
};

  const { theme } = useTheme();

  const {
    searchbar,
    searchbarDiv,
    inputGroup,
    searchbarButton,
    searchIcon,
    sliders,
    searchInput,
    sortPopup,
    sortTitle,
    modalTitle,
    checkIcon,
    checkIconEmpty,
    sortBy,
    searchbarDivDark,
    searchbarButtonDark,
    searchInputDark,
    slidersDark,
    sortPopupDark,
    modalTitleDark,
  } = styles;

  useEffect(() => {
    let popperInstance;

    if (smShow) {
      popperInstance = createPopper(
        buttonRef.current,
        document.querySelector(".sort-popup"),
        {
          placement: "bottom",
        }
      );
    } else {
      if (popperInstance) {
        popperInstance.destroy();
      }
    }

    return () => {
      if (popperInstance) {
        popperInstance.destroy();
      }
    };
  }, [smShow]);

  const handleClick = () => {
    setSmShow(!smShow);
  };

  return (
    <>
      <form className={searchbar} onSubmit={handleSubmit}>
        <div className={theme === "light" ? searchbarDiv : searchbarDivDark}>
          <div className={inputGroup}>
            <button
              id="button-addon"
              type="submit"
              className={`btn ${theme === "light" ? searchbarButton : searchbarButtonDark
                }`}
            >
              <Search className={searchIcon} />
            </button>
            <input
              type="search"
              placeholder="Search"
              aria-describedby="button-addon"
              className={`form-control rounded-pill border-0 color ${theme === "light" ? searchInput : searchInputDark
                }`}
              value={value}
              onChange={handleSearchChange}
            />
            <Sliders
              ref={buttonRef}
              onClick={handleClick}
              className={`${theme === "light" ? sliders : slidersDark
                } me-3 d-flex align-self-center`}
            />
            {smShow && (
              <OutsideClickHandler onOutsideClick={() => setSmShow(!smShow)}>
                <div className={`${theme === "light" ? sortPopup : sortPopupDark} sort-popup`}>
                  <div className={sortTitle}>
                    <p className={theme === "light" ? modalTitle : modalTitleDark}>Choose columns to search</p>
                  </div>
                  <div
                    onClick={() => handleCheck("projectName")}
                    className={sortBy}
                  >
                    {checked.projectName ? (
                      <CheckCircleFill className={checkIcon} />
                    ) : (
                      <Circle className={checkIconEmpty} />
                    )}
                    Project name
                  </div>
                  <div onClick={() => handleCheck("status")} className={sortBy}>
                    {checked.status ? (
                      <CheckCircleFill className={checkIcon} />
                    ) : (
                      <Circle className={checkIconEmpty} />
                    )}
                    Status
                  </div>
                </div>
              </OutsideClickHandler>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

export default ProjectsSearchBar;
