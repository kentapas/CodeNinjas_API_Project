import { createContext, useState, useEffect } from 'react';
import { getAllData } from '../services/get';
import { getAllUsers } from '../services/get';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [projects, setProjects] = useState([]);
    const [icon, setIcon] = useState("")
    const [update, setUpdate] = useState(0);
    const [show, setShow] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleShow = () => setShow(true);

    const fetchUserData = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };
  
    const fetchData = async () => {
      try {
        const { data: {projects}} = await getAllData();
        setProjects(projects);
      } catch (error) {
        setError(error.message);
      }
    };
  
    useEffect(() => {
      fetchUserData();
      fetchData()
    }, [update]);

    return (
        <StateContext.Provider value={{users, error, projects, setUpdate, setIcon, icon, show, setShow, 
          showMenu, setShowMenu, handleShow}}>
            {children}
            </StateContext.Provider>
    );
};