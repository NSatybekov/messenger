"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ChatService = void 0;
var common_1 = require("@nestjs/common");
var ChatService = /** @class */ (function () {
    function ChatService(repository, chatMemberService) {
        this.repository = repository;
        this.chatMemberService = chatMemberService;
    }
    ChatService.prototype.findUserChats = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var chatsInfo, chatIdArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatMemberService.getUserChats(user.user_id)];
                    case 1:
                        chatsInfo = _a.sent();
                        chatIdArray = chatsInfo.map(function (chat) { return chat.chat_id; });
                        return [2 /*return*/, this.repository.findChatById(chatIdArray)];
                }
            });
        });
    };
    ChatService.prototype.createStandartChat = function (chatName, user, secondUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var chatData, chat, chatMembers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chatData = {
                            name: chatName.name
                        };
                        return [4 /*yield*/, this.createChat(chatData)];
                    case 1:
                        chat = _a.sent();
                        return [4 /*yield*/, this.chatMemberService.createStandartChatMembers(chat.chat_id, user.user_id, secondUserId)];
                    case 2:
                        chatMembers = _a.sent();
                        return [2 /*return*/, {
                                chat: chat,
                                chatMembers: chatMembers
                            }];
                }
            });
        });
    };
    ChatService.prototype.createGroupChat = function (author, name, users) {
        return __awaiter(this, void 0, void 0, function () {
            var chat, userIds, usersData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createChat(name)];
                    case 1:
                        chat = _a.sent();
                        userIds = users.map(function (userId) { return parseInt(userId); });
                        usersData = __spreadArrays([
                            {
                                chat_id: chat.chat_id,
                                user_id: author.user_id,
                                role: 'admin'
                            }
                        ], userIds.map(function (userId) { return ({
                            chat_id: chat.chat_id,
                            user_id: userId,
                            role: 'member'
                        }); }));
                        return [2 /*return*/, this.chatMemberService.createMultipleChatMembers(usersData)];
                }
            });
        });
    };
    ChatService.prototype.createChat = function (chatData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repository.createChat(chatData)];
            });
        });
    };
    ChatService = __decorate([
        common_1.Injectable()
    ], ChatService);
    return ChatService;
}());
exports.ChatService = ChatService;
