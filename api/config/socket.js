const { Server } = require('socket.io');
const { CONFIG } = require('./configData');
const { user_data } = require('../models');

module.exports.socketConfig = (server) => {

    let onlineUsers = [], onlineUserForSend = [];

    const addNewUser = (userId, socketId) => {
        !onlineUsers.some((user) => user.userId === userId) && userId !== null &&
            onlineUsers.push({ userId, socketId });
        !onlineUserForSend.some((user) => user.userId === userId && user.socketId === socketId) && userId !== null &&
            onlineUserForSend.push({ userId, socketId });
    };

    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
        onlineUserForSend = onlineUserForSend.filter((user) => user.socketId !== socketId);
    };

    function updateLastSeen(userId) {
        user_data.update(
            { lastSeen: new Date() },
            { where: { _id: userId } }
        )
            .then(() => console.log("lastSeen updated"))
            .catch(err => console.log("Error updating lastSeen: ", err));
    }

    const io = new Server(server, {
        pingTimeout: 60000,
        cors: CONFIG.clientUrl
    })

    io.on('connection', (socket) => {
        console.log('Socket connected', socket.id);

        socket.on('setup', (userData) => {
            socket.join(userData?._id);
            socket.emit('connected')
        })

        socket.on("newUser", (user) => {
            if (user) {
                addNewUser(user, socket.id);
            }
            io.emit("getUsers", onlineUsers);
        });

        socket.on('join room', (room) => {
            socket.join(room);
        })

        socket.on("readMessage", (recieve) => {
            try {
                let chat = recieve.chatData;
                if (!chat.chat_Users) return console.log("chat.users not defined");
                chat.chat_Users.forEach((user) => {
                    if (user != recieve.sender._id) return;
                    let founSocketId = onlineUserForSend.filter((item) => item.userId == user)
                    if (!founSocketId) return;
                    founSocketId.map((item) => {
                        // console.log(item.socketId);
                        if (!item.socketId) return;
                        io.to(item.socketId).emit("readMessageSender", recieve);
                    })
                });
                //multiple recevier login means update read message all
                let getUsers = onlineUserForSend.filter((item) => recieve.loginUserId === item.userId)
                if (!getUsers) return;
                getUsers.map((item) => {
                    if (!item.socketId) return;
                    io.to(item.socketId).emit("readMessageUser", recieve);
                })
            } catch (error) {
                console.log("error in new msg socket", error);
            }
        })

        socket.on("fileMultiSend", (recieve) => {
            try {
                console.log("file multi send socket");
                if (!recieve) return console.log("file multi send not defined");
                if (!Array.isArray(recieve)) return console.log("file multi send is not array please send array");
                if (recieve.length == 0) return console.log("file multi send is empty array");
                let chat = recieve[0].chatData;
                if (!chat.chat_Users) return console.log("chat.users not defined");
                chat.chat_Users.forEach((user) => {
                    if (user == recieve[0].sender._id) return;
                    let founSocketId = onlineUserForSend.filter((item) => item.userId == user)
                    if (!founSocketId) return;
                    founSocketId.map((item) => {
                        // console.log(item.socketId);
                        if (!item.socketId) return;
                        io.to(item.socketId).emit("fileMultiSendRec", recieve);
                    })
                    // if(!founSocketId)  return;  
                    // console.log("new message file multi");
                    // io.to(founSocketId?.socketId).emit("fileMultiSendRec", recieve);   
                });

            } catch (error) {
                console.log("error in file multi socket", error);
            }
        })

        socket.on("new message", (recieve) => {
            try {
                console.log("new message socket" );
                let chat = recieve.chatData;
                if (!chat.chat_Users) return console.log("chat.users not defined");
                chat.chat_Users.forEach((user) => {
                    if (user == recieve.sender._id) return;
                    let founSocketId = onlineUserForSend.filter((item) => item.userId == user)
                    if (!founSocketId) return;
                    founSocketId.map((item) => {
                        console.log(item.socketId);
                        if (!item.socketId) return;
                        console.log("new message user", item?.userId);
                        io.to(item.socketId).emit("message recieved", recieve);
                    })
                    // if(!founSocketId)  return;   
                    // console.log("new message");
                    // io.to(founSocketId?.socketId).emit("message recieved", recieve);   
                });
            } catch (error) {
                console.log("error in new  msg socket", error);
            }
        });

        socket.on("userRemoveFromGroup", (recieve) => {
            try {

            } catch (error) {
                console.log("error in user remove from group socket", error);
            }
        });

        socket.on("delete message", (recieve) => {
            try {
                let chat = recieve.chatData;
                if (!chat.chat_Users) return console.log("chat.users not defined");
                chat.chat_Users.forEach((user) => {
                    if (user == recieve.sender._id) return;
                    let founSocketId = onlineUserForSend.filter((item) => item.userId == user)
                    if (!founSocketId) return;
                    founSocketId.map((item) => {
                        if (!item.socketId) return;
                        io.to(item.socketId).emit("message deleted", recieve);
                    })
                    // if (!founSocketId) return;
                    // io.to(founSocketId?.socketId).emit("message deleted", recieve);
                });
            } catch (error) {
                console.log("error in delete msg socket");
            }

        });

        socket.on('newGroupChatCreate', (grp) => {
            try {
                let users = grp.chat_Users
                if (grp.isGroupChat) {
                    users.forEach(user => {
                        if (user === grp.proAdmin._id) return;
                        let founSocketId = onlineUserForSend.filter((item) => item.userId == user)
                        if (!founSocketId) return;
                        founSocketId.map((item) => {
                            if (!item.socketId) return;
                            io.to(item.socketId).emit("newGroupChat", grp);
                        })
                        // if (!founSocketId) return;
                        // io.to(founSocketId?.socketId).emit("newGroupChat", grp);
                    })
                }
            } catch (error) {
                console.log("error in socket new group chat", error);
            }
        })

        socket.on('removeUserFromGrp', (id) => {
            try {
                if (id) {
                    let founSocketId = onlineUserForSend.filter((item) => item.userId == id)
                    if (!founSocketId) return;
                    founSocketId.map((item) => {
                        if (!item.socketId) return;
                        io.to(item.socketId).emit("removeUserFromGrpRec", id);
                    })
                    // if (!founSocketId) return;
                    // io.to(founSocketId?.socketId).emit("removeUserFromGrp", id);
                }
            } catch (error) {
                console.log("error in socket remove user from group chat", error);
            }
        })

        socket.on("logout", async () => {
            let findUser = onlineUsers.filter((user) => user.socketId === socket.id)
            if (findUser.length > 0) {
                let userId = findUser[0].userId;
                updateLastSeen(userId)
            }
            removeUser(socket.id);
            io.emit("getUsers", onlineUsers);
        });

        socket.on("disconnect", () => {
            let findUser = onlineUsers.filter((user) => user.socketId === socket.id)
            if (findUser.length > 0) {
                let userId = findUser[0].userId;
                updateLastSeen(userId)
            }
            // console.log("---------------------rs disconnect-------------------"); 
            removeUser(socket.id);
            io.emit("getUsers", onlineUsers);
        });

        socket.off("setup", () => {
            console.log("USER DISCONNECTED");
            removeUser(socket.id);
            socket.leave(userData._id);
        });
    })
}