import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useStore } from "../store";
import { HOST } from "../utils/constants.js";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { adminInfo } = useStore();

  useEffect(() => {
    if (adminInfo) {
      const socketInstance = io(HOST, {
        withCredentials: true,
        query: { userId: adminInfo._id },
      });

      socketInstance.on("connect", () => {
        console.log("Connected to socket server");
      });

      socketInstance.on("online-list", (data) => {
        const { setOnlineUsers } = useStore.getState();
        console.log(data)
        setOnlineUsers(data);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [adminInfo]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  return useContext(SocketContext);
};
