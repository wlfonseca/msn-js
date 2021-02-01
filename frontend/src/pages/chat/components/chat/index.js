import React, { useState } from "react";

import { MultiPoints, HeaderChat, Container, Sender } from "./styles";

//images
import points from "./assets/points.png";
import emotions from "./assets/emoticon.png";
import winks from "./assets/winks.png";
import tilt from "./assets/tilt.png";
import voice from "./assets/voice.png";

//components
import AeroButton from "../../../components/aeroButton/index";

//configs
import { socket } from "../../../../configs/socket_export";

const Chat = (props) => {
    const [messageText, setMessageText] = useState();

    const handleChangeMessageText = (event) => {
        setMessageText(event.target.value);
    };

    const sendMessageText = () => {
        if (!messageText || messageText === "" || messageText === " " || messageText === "") return false;

        setMessageText("");
        if (props.socketidUser && props.socketidPerson) {
            const socketidUser = props.socketidUser;
            const socketidPerson = props.socketidPerson;

            socket.emit("send server message text", { message: messageText, socketidUser, socketidPerson });
        }
    };

    const handleClickDrawAttention = () => {
        const socketidPerson = props.socketidPerson;
        socket.emit("Draw AttenAttention", socketidPerson);
    };

    const handleUserKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessageText();
        }
    };

    return (
        <>
            <MultiPoints>
                <img src={points} alt="" />
            </MultiPoints>
            <HeaderChat>
                <AeroButton disabled={true}>
                    <img src={emotions} alt="" />
                </AeroButton>
                <AeroButton disabled={true}>
                    <img src={winks} alt="" />
                </AeroButton>
                <AeroButton onCustomClick={handleClickDrawAttention}>
                    <img src={tilt} alt="" />
                </AeroButton>
                <AeroButton disabled={true}>
                    <img src={voice} alt="" />
                </AeroButton>
            </HeaderChat>

            <Container>
                <textarea onKeyPress={handleUserKeyPress} value={messageText} onChange={(e) => handleChangeMessageText(e)} cols="30" rows="10"></textarea>
            </Container>
            <Sender>
                <button onClick={sendMessageText}>Enviar</button>
            </Sender>
        </>
    );
};

export default Chat;
