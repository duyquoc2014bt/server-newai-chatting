/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("cors");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("http");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = __webpack_require__(2);
const auth_routes_1 = tslib_1.__importDefault(__webpack_require__(7));
const users_routes_1 = tslib_1.__importDefault(__webpack_require__(12));
const messages_routes_1 = tslib_1.__importDefault(__webpack_require__(15));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/users', users_routes_1.default);
router.use('/messages', messages_routes_1.default);
exports["default"] = router;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __webpack_require__(2);
const auth_controller_1 = __webpack_require__(8);
const authRouter = (0, express_1.Router)();
authRouter.post('/login', auth_controller_1.handleLogin);
authRouter.post('/logout', auth_controller_1.handleLogout);
exports["default"] = authRouter;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleLogout = exports.handleLogin = void 0;
const auth_service_1 = __webpack_require__(9);
const handleLogin = (req, res) => {
    const { username } = req.body;
    if (!username)
        return res.status(400).json({ error: 'Username is required' });
    return res.json(auth_service_1.AuthService.login(username));
};
exports.handleLogin = handleLogin;
const handleLogout = (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    const result = auth_service_1.AuthService.logout(userId);
    if (result.error) {
        return res.status(404).json(result);
    }
    return res.status(200).json(result);
};
exports.handleLogout = handleLogout;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const uuid_1 = __webpack_require__(10);
const chat_repository_1 = __webpack_require__(11);
exports.AuthService = {
    login: (username) => {
        const existingUser = chat_repository_1.ChatRepository.getUsersOnline().find((u) => u.username === username);
        if (existingUser && existingUser.online) {
            return null;
        }
        if (existingUser) {
            existingUser.online = true;
            return existingUser;
        }
        const newUser = { id: (0, uuid_1.v4)(), username, online: true };
        chat_repository_1.ChatRepository.addUser(newUser);
        return newUser;
    },
    logout: (userId) => {
        const user = chat_repository_1.ChatRepository.getUsersOnline().find((u) => u.id === userId);
        if (!user) {
            return { error: 'User not found' };
        }
        chat_repository_1.ChatRepository.removeUser(userId);
        return { message: 'User logged out' };
    },
};


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatRepository = void 0;
const uuid_1 = __webpack_require__(10);
const chatHistory = [];
let onlineUsers = [];
exports.ChatRepository = {
    getHistory: (userId, receiverId) => chatHistory
        .filter((msg) => (msg.sender.id === userId && msg.receiver.id === receiverId) ||
        (msg.sender.id === receiverId && msg.receiver.id === userId))
        .slice(-50),
    addMessage: (sender, receiver, message) => {
        const chatMessage = {
            id: (0, uuid_1.v4)(),
            sender,
            receiver,
            message,
            timestamp: Date.now(),
        };
        chatHistory.push(chatMessage);
        if (chatHistory.length > 50)
            chatHistory.shift();
        return chatMessage;
    },
    addUser: (user) => {
        const existingUser = onlineUsers.find((u) => u.id === user.id);
        if (!existingUser) {
            onlineUsers.push(user);
        }
        else {
            existingUser.online = true;
        }
        return onlineUsers;
    },
    removeUser: (userId) => {
        onlineUsers = onlineUsers.filter((user) => user.id !== userId);
        return onlineUsers;
    },
    getUsersOnline: () => onlineUsers,
};


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __webpack_require__(2);
const users_controller_1 = __webpack_require__(13);
const usersRouter = (0, express_1.Router)();
usersRouter.get('/online', users_controller_1.handleGetOnlineUsers);
exports["default"] = usersRouter;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleGetOnlineUsers = void 0;
const users_service_1 = __webpack_require__(14);
const handleGetOnlineUsers = (req, res) => {
    return res.json(users_service_1.UsersService.getOnlineUsers());
};
exports.handleGetOnlineUsers = handleGetOnlineUsers;


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const chat_repository_1 = __webpack_require__(11);
exports.UsersService = {
    getOnlineUsers: () => {
        return chat_repository_1.ChatRepository.getUsersOnline();
    },
};


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __webpack_require__(2);
const messages_controller_1 = __webpack_require__(16);
const messagesRouter = (0, express_1.Router)();
messagesRouter.get('/history/:userId/:receiverId', messages_controller_1.handleGetChatHistory);
exports["default"] = messagesRouter;


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleGetChatHistory = void 0;
const messages_service_1 = __webpack_require__(17);
const handleGetChatHistory = (req, res) => {
    const { userId, receiverId } = req.params;
    if (!userId || !receiverId) {
        return res
            .status(400)
            .json({ error: 'Both userId and receiverId are required' });
    }
    const chatHistory = messages_service_1.MessagesService.getChatHistory(userId, receiverId);
    return res.json(chatHistory);
};
exports.handleGetChatHistory = handleGetChatHistory;


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessagesService = void 0;
const chat_repository_1 = __webpack_require__(11);
exports.MessagesService = {
    sendMessage: (sender, receiver, message) => {
        return chat_repository_1.ChatRepository.addMessage(sender, receiver, message);
    },
    getChatHistory: (userId, receiverId) => {
        return chat_repository_1.ChatRepository.getHistory(userId, receiverId);
    },
};


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatSocket = void 0;
const auth_service_1 = __webpack_require__(9);
const messages_service_1 = __webpack_require__(17);
const users_service_1 = __webpack_require__(14);
const userSockets = {};
const ChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.id}`);
        socket.on('user:login', (username) => {
            const user = auth_service_1.AuthService.login(username);
            if (!user) {
                socket.emit('error', {
                    event: 'user:login',
                    message: 'Username is already taken',
                });
                return;
            }
            socket.data.user = user;
            userSockets[user.id] = socket.id;
            io.emit('usersOnline', {
                event: 'usersOnline',
                data: users_service_1.UsersService.getOnlineUsers(),
            });
        });
        socket.on('message:send', ({ receiver, message }) => {
            const sender = socket.data.user;
            if (!sender) {
                socket.emit('error', {
                    event: 'message:send',
                    message: 'User not logged in',
                });
                return;
            }
            if (!receiver || !receiver.id) {
                socket.emit('error', {
                    event: 'message:send',
                    message: 'Receiver is required',
                });
                return;
            }
            const receiverUser = users_service_1.UsersService.getOnlineUsers().find((user) => user.id === receiver.id);
            if (!receiverUser) {
                socket.emit('error', {
                    event: 'message:send',
                    message: 'Receiver not found',
                });
                return;
            }
            const chatMessage = messages_service_1.MessagesService.sendMessage(sender, receiverUser, message);
            socket.emit('message:receive', {
                event: 'message:receive',
                data: chatMessage,
            });
            const receiverSocketId = userSockets[receiver.id];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('message:receive', {
                    event: 'message:receive',
                    data: chatMessage,
                });
            }
        });
        socket.on('disconnect', () => {
            const user = socket.data.user;
            if (user) {
                auth_service_1.AuthService.logout(user.id);
                delete userSockets[user.id];
                io.emit('usersOnline', {
                    event: 'usersOnline',
                    data: users_service_1.UsersService.getOnlineUsers(),
                });
            }
        });
    });
};
exports.ChatSocket = ChatSocket;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(2));
const cors_1 = tslib_1.__importDefault(__webpack_require__(3));
const http_1 = __webpack_require__(4);
const socket_io_1 = __webpack_require__(5);
const routes_1 = tslib_1.__importDefault(__webpack_require__(6));
const chat_socket_1 = __webpack_require__(18);
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: '*' },
    addTrailingSlash: false,
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', routes_1.default);
(0, chat_socket_1.ChatSocket)(io);
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`🚀 Server running at http://0.0.0.0:${PORT}`));

})();

/******/ })()
;