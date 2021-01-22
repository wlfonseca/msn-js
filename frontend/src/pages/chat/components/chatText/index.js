import React, { useEffect } from "react";
import { Container, MessageStatus } from "./styles";

//images
import information from "./assets/information.png";

const ChatText = React.forwardRef((props, ref) => {
    useEffect(() => {});

    return (
        <>
            {props.status === "invisible" && (
                <MessageStatus id="info-status">
                    <img src={information} alt="image" />
                    Este contato está offline.
                </MessageStatus>
            )}
            {props.status === "busy" && (
                <MessageStatus id="info-status">
                    <img src={information} alt="image" />
                    Este contato está ocupado e pode não responder.
                </MessageStatus>
            )}
            {props.status === "away" && (
                <MessageStatus id="info-status">
                    <img src={information} alt="image" />
                    Este contato está ausente e pode não responder.
                </MessageStatus>
            )}
            <Container className="div-messages-text" id={props.socketidperson} ref={ref}>
                {props.children}
            </Container>
        </>
    );
});

export default ChatText;
