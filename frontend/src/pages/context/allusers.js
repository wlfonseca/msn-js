import React, { createContext, useState, useContext, useEffect } from "react";

import { connect, socket } from "../../configs/socket_export";

const UserContext = createContext();

export default function UserProvider({ children }) {
    const [contactsOnline, setContactsOnline] = useState([]);
    const [countContactsOnline, setCountContactsOnline] = useState(0);
    const [userChats, setUserChats] = useState([]);
    const [theme, setTheme] = useState("blue");

    useEffect(() => {
        socket.on("socketsConnected", (data) => {
            console.log(data.status);
            setCountContactsOnline(data.length - 1);
            setContactsOnline(data);
        });

        socket.on("refresh multi chats", (data) => {
            setUserChats(data);
        });
    }, []);

    const getPerson = (socketid) => {
        if (contactsOnline) {
            let person = contactsOnline.find((elem) => elem.socketid === socketid);
            return person;
        }
    };

    const getUser = async (socketid) => {
        if (await contactsOnline) {
            let person = contactsOnline.find((elem) => elem.socketid === socketid);
            return person;
        }
    };

    const changeTheme = () => {
        if (theme === "blue") {
            setTheme("pink");
        } else if (theme === "pink") {
            setTheme("yellow");
        } else if (theme === "yellow") {
            setTheme("green");
        } else if (theme === "green") {
            setTheme("blue");
        }
    };

    return (
        <UserContext.Provider
            value={{
                contactsOnline,
                countContactsOnline,
                userChats,
                getPerson,
                getUser,
                theme,
                changeTheme,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useCount must be used within a CountProvider");

    const { contactsOnline, countContactsOnline, userChats, getPerson, getUser, theme, changeTheme } = context;

    return { contactsOnline, countContactsOnline, userChats, getPerson, getUser, theme, changeTheme };
}
