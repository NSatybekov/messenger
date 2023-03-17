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
exports.PostsService = void 0;
var common_1 = require("@nestjs/common");
var comments_service_1 = require("src/comments/comments.service");
var PostsService = /** @class */ (function () {
    function PostsService(repository, friendService, kafkaProduce, commentService) {
        this.repository = repository;
        this.friendService = friendService;
        this.kafkaProduce = kafkaProduce;
        this.commentService = commentService;
    }
    PostsService.prototype.createPost = function (user, postName, postText) {
        return __awaiter(this, void 0, Promise, function () {
            var postData, post, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        postData = {
                            user_id: user.user_id,
                            name: postName,
                            text: postText
                        };
                        return [4 /*yield*/, this.repository.createPost(postData)];
                    case 1:
                        post = _b.sent();
                        return [4 /*yield*/, this.produceToKafka(postText, user.user_id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, post];
                    case 3:
                        _a = _b.sent();
                        throw new common_1.HttpException('Cannot create', 404);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostsService.prototype.createPostToDb = function (postData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repository.createPost(postData)];
            });
        });
    };
    PostsService.prototype.produceToKafka = function (postText, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var idString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, userId.toString()];
                    case 1:
                        idString = _a.sent();
                        this.kafkaProduce.produce({
                            topic: 'Created_post',
                            messages: [{ key: idString, value: postText }]
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    PostsService.prototype.getUserPosts = function (user_id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repository.findUserPosts(user_id)];
            });
        });
    };
    PostsService.prototype.editPostTry = function (user, post_id, postName, postText) {
        return __awaiter(this, void 0, void 0, function () {
            var author, status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isUserAuthor(user.user_id, post_id)];
                    case 1:
                        author = _a.sent();
                        if (!author) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.editPost(post_id, postName, postText)];
                    case 2:
                        status = _a.sent();
                        if (status) {
                            return [2 /*return*/, this.repository.findPostById(post_id)];
                        }
                        else {
                            throw new common_1.HttpException('Post not updated', 404);
                        }
                        return [3 /*break*/, 4];
                    case 3: throw new common_1.HttpException('YOu are not author', 404);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostsService.prototype.editPost = function (post_id, postName, postText) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repository.editPost(post_id, postText, postName)];
            });
        });
    };
    PostsService.prototype.deletePost = function (user, post_id) {
        return __awaiter(this, void 0, void 0, function () {
            var author;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isUserAuthor(user.user_id, post_id)];
                    case 1:
                        author = _a.sent();
                        if (author) {
                            return [2 /*return*/, this.repository.deletePost(post_id)];
                        }
                        else {
                            throw new common_1.HttpException('You are not authour', 404);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PostsService.prototype.isUserAuthor = function (user_id, post_id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.isUserPostAuthor(user_id, post_id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PostsService.prototype.getAnotherUsersPosts = function (user, friend_id) {
        return __awaiter(this, void 0, void 0, function () {
            var isBlocked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.friendService.blockStatus(user.user_id, friend_id)];
                    case 1:
                        isBlocked = _a.sent();
                        if (!isBlocked) {
                            return [2 /*return*/, this.getUserPosts(friend_id)];
                        }
                        else {
                            throw new common_1.HttpException('You are blocked', 404);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PostsService.prototype.getFeedPosts = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var friendList, sentList, sentIds, allIds, userIds, allUserIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.friendService.getFriendList(user)];
                    case 1:
                        friendList = _a.sent();
                        return [4 /*yield*/, this.friendService.getSentFriendRequests(user)];
                    case 2:
                        sentList = _a.sent();
                        try {
                            sentIds = sentList.map(function (sent) { return sent.friend_id; });
                            allIds = friendList.flatMap(function (friend) {
                                var arrayAll = [friend.friend_id, friend.user_id]; // create array that will flat (join) this small arrays that contain friend id and user id
                                return arrayAll;
                            });
                            userIds = Array.from(new Set(allIds));
                            allUserIds = userIds.concat(sentIds);
                            return [2 /*return*/, this.repository.getFeedPosts(allUserIds)];
                        }
                        catch (_b) {
                            throw new common_1.HttpException('Something wrong', 404);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PostsService.prototype.getPostInfoById = function (post_id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repository.findPostById(post_id)];
            });
        });
    };
    PostsService.prototype.findPostByText = function (user, text) {
        return __awaiter(this, void 0, void 0, function () {
            var posts, comments, postIdsFromComment, postsFromComments, allPosts, filteredPosts, _i, allPosts_1, post, isBlocked, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.repository.findPostByText(text)];
                    case 1:
                        posts = _b.sent();
                        return [4 /*yield*/, this.commentService.findCommentsByText(text)];
                    case 2:
                        comments = _b.sent();
                        postIdsFromComment = comments.map(function (comment) { return comment.post_id; });
                        return [4 /*yield*/, this.repository.findPostsByIdsArray(postIdsFromComment)];
                    case 3:
                        postsFromComments = _b.sent();
                        allPosts = postsFromComments.concat(posts);
                        filteredPosts = [];
                        _i = 0, allPosts_1 = allPosts;
                        _b.label = 4;
                    case 4:
                        if (!(_i < allPosts_1.length)) return [3 /*break*/, 7];
                        post = allPosts_1[_i];
                        return [4 /*yield*/, this.friendService.blockStatus(user.user_id, post.user_id)];
                    case 5:
                        isBlocked = _b.sent();
                        if (!isBlocked) {
                            filteredPosts.push(post);
                        }
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: // probably better to get data from DB already without users from block list to optimize it
                    return [2 /*return*/, {
                            posts: posts,
                            postsFromComments: postsFromComments,
                            filteredPosts: filteredPosts
                        }];
                    case 8:
                        _a = _b.sent();
                        throw new common_1.HttpException('No such post', 404);
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    PostsService = __decorate([
        common_1.Injectable(),
        __param(3, common_1.Inject(common_1.forwardRef(function () { return comments_service_1.CommentsService; })))
    ], PostsService);
    return PostsService;
}());
exports.PostsService = PostsService;
