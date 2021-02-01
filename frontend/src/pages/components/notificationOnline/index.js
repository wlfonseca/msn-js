import React, { useEffect, useState, useRef } from "react";

import { Container } from "./styles";

import NotificationSystem from "react-notification-system";

//components sounds
import playsound from "../../../scripts/sounds/sounds";

//images
import msnLogo from "./assets/msn-logo.png";

//icons
import { AiOutlineClose } from "react-icons/ai";

//components
import ModalBorder from "../../components/modalBorder/index";

//configs
import { socket, connect } from "../../../configs/socket_export";

//context
import { useUser } from "../../context/allusers";

const NotificationOnline = () => {
    const [person, setPerson] = useState();
    const [statusUser, setStatusUser] = useState();
    const notificationSystem = useRef();
    const ButtonnotificationSystem = useRef();

    const { getUser } = useUser();

    const stylemsn = {
        Containers: {
            DefaultStyle: {
                fontFamily: "inherit",
                position: "fixed",
                width: "250px",
                padding: "0 10px 10px 10px",
                zIndex: 9998,
                WebkitBoxSizing: "border-box",
                MozBoxSizing: "border-box",
                boxSizing: "border-box",
            },
        },
        NotificationItem: {
            info: {
                // Applied only to the success notification item
                color: "red",
            },
            DefaultStyle: {
                position: "relative",
                background: "transparent",
                width: "100%",
                height: "130px",
                cursor: "pointer",
                borderRadius: "2px",
                fontSize: "13px",
                margin: "10px 0 0",
                padding: "10px",
                display: "block",
                WebkitBoxSizing: "border-box",
                MozBoxSizing: "border-box",
                boxSizing: "border-box",
                opacity: 0,
                transition: "0.3s ease-in-out",
                WebkitTransform: "translate3d(0, 0, 0)",
                transform: "translate3d(0, 0, 0)",
                willChange: "transform, opacity",

                isHidden: {
                    opacity: 0,
                },

                isVisible: {
                    opacity: 1,
                },
            },

            info: {
                borderTop: "2px solid " + "transparent",
                backgroundColor: "#e8f0f4",
                color: "#41555d",
                WebkitBoxShadow: "0 0 1px rgba(" + (236, 61, 61) + "," + 0.9 + ")",
                MozBoxShadow: "0 0 1px rgba(" + (236, 61, 61) + "," + 0.9 + ")",
                boxShadow: "0 0 1px rgba(" + (236, 61, 61) + "," + 0.9 + ")",
            },
        },
    };

    const addNotification = (event) => {
        // event.preventDefault();
        playsound("online");
        notificationSystem.current.addNotification({
            level: "info",
            position: "br",
            children: (
                <Container>
                    <div id="header">
                        <img src={msnLogo} alt="msn logo" />
                        <p>Windows Live MessengerJS</p>
                        <AiOutlineClose />
                    </div>
                    <div id="body">
                        {person ? <ModalBorder avatar={person.avatar} size="32" minus="12" left="4px" top="4px" /> : <ModalBorder avatar="" size="32" minus="12" left="4px" top="4px" />}

                        <div id="body-username">
                            <p>{person ? person.username : "Alguém"}</p>
                            <p>acabou de entrar.</p>
                        </div>
                    </div>
                </Container>
            ),
        });
    };

    useEffect(() => {
        socket.on("socket connected notification", (data) => {
            setPerson(data);
            ButtonnotificationSystem.current.click();
        });
    }, []);

    return (
        <>
            <NotificationSystem ref={notificationSystem} style={stylemsn} />
            <button id="button-add-notification" onClick={addNotification} style={{ position: "absolute", zIndex: "-3" }} ref={ButtonnotificationSystem} />
        </>
    );
};

export { NotificationOnline };