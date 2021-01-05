const app = require("express")();
const cors = require("cors");
const server = require("http").createServer(app);

const bodyparser = require("body-parser");

const { addUser, socketsConnected, removeUser, closeChat, changeVisible, sendMessage, assignChat, drawAttenAttention } = require("./models");

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const port = process.env.PORT || 80;

// const io = require("socket.io")(server);

const io = require("socket.io")(server, {
    cors: {
        origin: "msn-js.vercel.app",
        methods: ["GET", "POST"],
    },
});

app.get("/", (req, res) => {
    res.send("Olá mundo ");
});

app.post("/teste", (req, res) => {
    res.send("Olá mundo teste post ok");
});

app.get("/statusall", (req, res) => {
    return res.json({
        socketsConnected,
    });
});

io.on("connection", (socket) => {
    console.log("a user connected: " + socket.id);

    addUser(socket); //Adicionando o usuario que entrou na lista de sockets online
    io.emit("socketsConnected", socketsConnected); // Mandando para os clientes que o socket entrou

    socket.on("send server message text", ({ message, socketidUser, socketidPerson }) => {
        const updateChatsPerson = sendMessage(socket, message, socketidUser, socketidPerson);

        if (updateChatsPerson) {
            io.to(socketidPerson).emit("refresh multi chats", updateChatsPerson); // retornando a lista de chats do usuario que clicou
        }
        io.to(socketidUser).emit("send client message text", { message, socketidUser, socketidPerson }); //mandando para o usuario que mandou a msg
        io.to(socketidPerson).emit("send client message text", { message, socketidUser, socketidPerson }); //mandando para o usuario que mandou a msg
    });

    socket.on("Draw AttenAttention", (socketidperson) => {
        const userChats = changeVisible(socket.id, socketidperson); // troca o visible de true para false e ao contrario também, e pega os chats novamente
        io.to(socket.id).emit("refresh multi chats", userChats); //manda os chats com o atributo do visible atualizado
    });

    socket.on("change visible chat", (socketidperson) => {
        const userChats = changeVisible(socket.id, socketidperson); // troca o visible de true para false e ao contrario também, e pega os chats novamente
        io.to(socket.id).emit("refresh multi chats", userChats); //manda os chats com o atributo do visible atualizado
    });

    socket.on("click on chat", (socketidperson) => {
        const userChats = assignChat(socket.id, socketidperson, "user"); // mandando o socket id person para a lista do socket user
        io.to(socket.id).emit("refresh multi chats", userChats); // retornando a lista de chats do usuario que clicou
    });

    socket.on("close chat", (socketidperson) => {
        const userChats = closeChat(socket, socketidperson); //retornando chats do user
        io.to(socket.id).emit("refresh multi chats", userChats); //envia para o client a nova lista
    });

    socket.on("disconnect", () => {
        removeUser(socket); //remove o socket da lista
        io.emit("socketsConnected", socketsConnected); //envia para o client a nova lista
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
