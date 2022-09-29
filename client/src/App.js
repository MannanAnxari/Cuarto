import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./components/Sidebar";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { AppContext, socket } from "./context/appContext";
import Profile from "./components/Profile";
import Alert from "./components/Alert";

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [allgroups, setAllGroups] = useState([]);
  const [currentRoomCreatorId, setCurrentRoomCreatorId] = useState("");
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});
  const user = useSelector((state) => state.user);
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    fetchGroups();
    if (!user) {
      return <>Please Login</>;
    }
    if (user) {
      fetchGroups();
    }
  }, []);

  async function fetchGroups() {
    await fetch("http://localhost:8000/fetchallgroups", { method: "POST" })
      // await fetch("https://cuarta.herokuapp.com/fetchallgroups", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setAllGroups(data.allgroup);
      });
  }
  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  return (
    <AppContext.Provider
      value={{
        socket,
        currentRoom,
        setCurrentRoom,
        currentRoomCreatorId,
        setCurrentRoomCreatorId,
        members,
        setMembers,
        allgroups,
        setAllGroups,
        messages,
        setMessages,
        privateMemberMsg,
        setPrivateMemberMsg,
        rooms,
        setRooms,
        newMessages,
        setNewMessages,
      }}
    >
      <BrowserRouter>
        <Alert alert={alert} />
        <Routes>
          <Route path="/" element={<Home />} />
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          <Route path="/chat" element={<Chat showAlert={showAlert} />} />
          <Route path="/profile" element={<Profile showAlert={showAlert} />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
