"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.__esModule = true;
exports.CommentsService = void 0;
var common_1 = require("@nestjs/common");
var posts_service_1 = require("src/posts/posts.service");
var CommentsService = /** @class */ (function () {
    function CommentsService(repository, friendService, postService, kafkaProduce) {
        this.repository = repository;
        this.friendService = friendService;
        this.postService = postService;
        this.kafkaProduce = kafkaProduce;
    }
    CommentsService.prototype.addComment = function (user, post_id, text) {
        return __awaiter(this, void 0, void 0, function () {
            var commentData, comment, postInfo, isBlocked, comment_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commentData = {
                            user_id: user.user_id,
                            post_id: post_id,
                            text: text
                        };
                        return [4 /*yield*/, this.repository.addComment(commentData)];
                    case 1:
                        comment = _a.sent();
                        return [4 /*yield*/, this.produceToKafka(comment)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.postService.getPostInfoById(post_id)];
                    case 3:
                        postInfo = _a.sent();
                        return [4 /*yield*/, this.friendService.blockStatus(user.user_id, postInfo.user_id)];
                    case 4:
                        isBlocked = _a.sent();
                        if (!!isBlocked) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.repository.addComment(commentData)];
                    case 5:
                        comment_1 = _a.sent();
                        return [4 /*yield*/, this.produceToKafka(comment_1)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, comment_1];
                    case 7: throw new common_1.HttpException('You are block', 404);
                }
            });
        });
    };
    // async random(){
    //     const totalUsers = 101;
    //     const maxCommentsPerPost = 10;
    //     const postIds = Array.from({ length: 120001 - 4500 }, (_, i) => i + 4500);
    //     for (const postId of postIds) {
    //       for (let i = 0; i < maxCommentsPerPost; i++) {
    //         const userId = faker.datatype.number({ min: 1, max: totalUsers });
    //         const postText = faker.lorem.paragraphs().slice(0, 500);
    //         await this.addComment(userId, postId, postText);
    //       }
    //     }
    // }
    CommentsService.prototype.produceToKafka = function (commentData) {
        return __awaiter(this, void 0, void 0, function () {
            var idString, dataToKafka;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, commentData.comment_id.toString()];
                    case 1:
                        idString = _a.sent();
                        dataToKafka = JSON.stringify(commentData);
                        this.kafkaProduce.produce({
                            topic: 'created_comment',
                            messages: [{
                                    key: idString,
                                    value: dataToKafka
                                }]
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CommentsService.prototype.getPostComments = function (user, post_id) {
        return __awaiter(this, void 0, void 0, function () {
            var postInfo, isBlocked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postService.getPostInfoById(post_id)];
                    case 1:
                        postInfo = _a.sent();
                        return [4 /*yield*/, this.friendService.blockStatus(user.user_id, postInfo.user_id)];
                    case 2:
                        isBlocked = _a.sent();
                        if (!isBlocked) {
                            return [2 /*return*/, this.repository.getPostComments(post_id)];
                        }
                        else {
                            throw new common_1.HttpException('Cant add comment', 404);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CommentsService.prototype.getMyComments = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserComments(user.user_id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentsService.prototype.getUserCommentTry = function (user, secondUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var isBlocked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.friendService.blockStatus(user.user_id, secondUserId)];
                    case 1:
                        isBlocked = _a.sent();
                        if (!isBlocked) {
                            return [2 /*return*/, this.repository.getUsersComments(secondUserId)];
                        }
                        else {
                            throw new common_1.HttpException('Cant get comment', 404);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CommentsService.prototype.getUserComments = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.getUsersComments(user_id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CommentsService.prototype.deleteComment = function (user, comment_id) {
        return __awaiter(this, void 0, void 0, function () {
            var postInfo, isAuthor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPostInfoByComment(comment_id)];
                    case 1:
                        postInfo = _a.sent();
                        return [4 /*yield*/, this.isUserAuthor(user.user_id, comment_id)];
                    case 2:
                        isAuthor = _a.sent();
                        if (isAuthor || postInfo.user_id === user.user_id) { // if user is post owner he can delete comment
                            return [2 /*return*/, this.repository.deleteComment(comment_id)];
                        }
                        else {
                            throw new common_1.HttpException('Cant delete comment', 404);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CommentsService.prototype.editComment = function (user, comment_id, newText) {
        return __awaiter(this, void 0, void 0, function () {
            var isAuthor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isUserAuthor(user.user_id, comment_id)];
                    case 1:
                        isAuthor = _a.sent();
                        if (isAuthor) {
                            return [2 /*return*/, this.repository.editComment(comment_id, newText)];
                        }
                        else {
                            throw new common_1.HttpException('Cant edit comment', 404);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CommentsService.prototype.isUserAuthor = function (user_id, comment_id) {
        return __awaiter(this, void 0, Promise, function () {
            var comment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.getCommentById(comment_id)];
                    case 1:
                        comment = _a.sent();
                        if (user_id === comment.user_id) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CommentsService.prototype.getPostInfoByComment = function (comment_id) {
        return __awaiter(this, void 0, Promise, function () {
            var commentInfo, postInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.getCommentById(comment_id)];
                    case 1:
                        commentInfo = _a.sent();
                        return [4 /*yield*/, this.postService.getPostInfoById(commentInfo.post_id)];
                    case 2:
                        postInfo = _a.sent();
                        return [2 /*return*/, postInfo];
                }
            });
        });
    };
    CommentsService.prototype.findCommentsByText = function (text) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repository.findCommentByText(text)];
            });
        });
    };
    CommentsService.prototype.getAllComments = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repository.getAllComments()];
            });
        });
    };
    CommentsService = __decorate([
        common_1.Injectable(),
        __param(2, common_1.Inject(common_1.forwardRef(function () { return posts_service_1.PostsService; })))
    ], CommentsService);
    return CommentsService;
}());
exports.CommentsService = CommentsService;
