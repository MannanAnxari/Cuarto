import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import toast from "react-hot-toast";
import Chat from "./components/Sidebar";
import { resetNotifications } from "./features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { AppContext, socket } from "./context/appContext";
import Profile from "./components/Profile";
import Alert from "./components/Alert";
import { useFetchAllGroupsMutation } from './services/appApi';

function App() {
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [allgroups, setAllGroups] = useState([]);
  const [currentRoomCreatorId, setCurrentRoomCreatorId] = useState("");
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});
  const [activePhoneChatBox, setactivePhoneChatBox] = useState(false);
  const [sendScreenStatus, setsendScreenStatus] = useState(false);
  const user = useSelector((state) => state.user);
  const [alert, setAlert] = useState(null);
  const [fetchAllGroups] = useFetchAllGroupsMutation();

  useEffect(() => {
    fetchGroups();
    if (!user) {
      return <>Please Login</>;
    }
    if (user) {
      fetchGroups();
    }
  }, []);
  function joinRoom(room, isPublic = true, id, pass) {
    socket.emit("join-room", room, currentRoom, id);
    setCurrentRoom(room);
    setactivePhoneChatBox(true)
    if (isPublic) {
      setPrivateMemberMsg(null);
    }
    dispatch(resetNotifications(room));
  }


  const fetchGroups = () => {
    // fetch all groups
    fetchAllGroups().then(({ data }) => {
      if (data) {
        setAllGroups(data.allgroup);
      }
      else {
        toast.error(data.error);
      }
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
        joinRoom,
        activePhoneChatBox,
        setactivePhoneChatBox,
        allgroups,
        setAllGroups,
        messages,
        setMessages,
        privateMemberMsg,
        setPrivateMemberMsg,
        rooms,
        sendScreenStatus,
        setsendScreenStatus,
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
