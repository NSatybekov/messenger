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
exports.__esModule = true;
exports.SearchService = void 0;
var common_1 = require("@nestjs/common");
var SearchService = /** @class */ (function () {
    function SearchService(consumerService, elasticSearchService, postService, commentService) {
        this.consumerService = consumerService;
        this.elasticSearchService = elasticSearchService;
        this.postService = postService;
        this.commentService = commentService;
        this.postIndex = 'created_post';
        this.commentIndex = 'created_comment';
    }
    SearchService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.consumerService.consume('searchGroup', { topics: ['created_post'] }, {
                                eachMessage: function (_a) {
                                    var topic = _a.topic, partition = _a.partition, message = _a.message;
                                    return __awaiter(_this, void 0, void 0, function () {
                                        var postData;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    postData = JSON.parse(message.value.toString());
                                                    return [4 /*yield*/, this.elasticSearchService.index({
                                                            index: topic.toString(),
                                                            body: postData
                                                        })];
                                                case 1:
                                                    _b.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    });
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.consumerService.consume('searchGroupComments', { topics: ['created_comment'] }, {
                                eachMessage: function (_a) {
                                    var topic = _a.topic, partition = _a.partition, message = _a.message;
                                    return __awaiter(_this, void 0, void 0, function () {
                                        var commentData;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    commentData = JSON.parse(message.value.toString());
                                                    return [4 /*yield*/, this.elasticSearchService.index({
                                                            index: topic.toString(),
                                                            body: commentData
                                                        })];
                                                case 1:
                                                    _b.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    });
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log('error');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SearchService.prototype.reindexData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allPosts, bulkData, bulkResponse, errorMessage, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.elasticSearchService.deleteByQuery({
                                index: this.postIndex,
                                body: {
                                    query: {
                                        match_all: {}
                                    }
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.postService.getAllPostsList()];
                    case 2:
                        allPosts = _a.sent();
                        bulkData = allPosts.flatMap(function (doc) { return [
                            { index: { _index: _this.postIndex, _id: doc.post_id } },
                            { user_id: doc.user_id, name: doc.name, text: doc.text, created_at: doc.created_at },
                        ]; });
                        return [4 /*yield*/, this.elasticSearchService.bulk({ refresh: true, body: bulkData })];
                    case 3:
                        bulkResponse = _a.sent();
                        if (bulkResponse.errors) {
                            errorMessage = bulkResponse.items
                                .map(function (item) { return "Error: " + JSON.stringify(item.index.error); })
                                .join('\n');
                            console.error("Failed to index data:\n" + errorMessage);
                        }
                        else {
                            return [2 /*return*/, ("Successfully indexed " + bulkResponse.items.length + " items")];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        throw new common_1.HttpException(err_2, 404);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SearchService.prototype.reindexComments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allComments, batchedComments, batchSize, i, delayMs_1, i, batch, bulkData, bulkResponse, errorMessage, err_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.elasticSearchService.deleteByQuery({
                                index: this.commentIndex,
                                body: {
                                    query: {
                                        match_all: {}
                                    }
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.commentService.getAllComments()];
                    case 2:
                        allComments = _a.sent();
                        console.log(allComments.length);
                        batchedComments = [];
                        batchSize = 50000;
                        for (i = 0; i < allComments.length; i += batchSize) {
                            batchedComments.push(allComments.slice(i, i + batchSize));
                        }
                        delayMs_1 = 10000;
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < batchedComments.length)) return [3 /*break*/, 7];
                        batch = batchedComments[i];
                        bulkData = batch.flatMap(function (doc) { return [
                            { index: { _index: _this.commentIndex, _id: doc.post_id } },
                            { user_id: doc.user_id, comment_id: doc.comment_id, text: doc.text, created_at: doc.created_at, post_id: doc.post_id },
                        ]; });
                        return [4 /*yield*/, this.elasticSearchService.bulk({
                                refresh: "wait_for",
                                body: bulkData
                            })];
                    case 4:
                        bulkResponse = _a.sent();
                        if (bulkResponse.errors) {
                            errorMessage = bulkResponse.items
                                .map(function (item) { return "Error: " + JSON.stringify(item.index.error); })
                                .join('\n');
                            console.error("Failed to index data:\n" + errorMessage);
                        }
                        else {
                            console.log("Successfully indexed " + bulkResponse.items.length + " items");
                        }
                        // Delay before sending the next batch
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delayMs_1); })];
                    case 5:
                        // Delay before sending the next batch
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 3];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_3 = _a.sent();
                        throw new common_1.HttpException(err_3.message, 404, { cause: new Error(err_3) });
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SearchService.prototype.search = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var postIds, response, hits, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchPostsIdsByTextFromComments(text)];
                    case 1:
                        postIds = _a.sent();
                        return [4 /*yield*/, this.elasticSearchService.search({
                                index: this.postIndex,
                                body: {
                                    query: {
                                        bool: {
                                            should: [
                                                {
                                                    multi_match: {
                                                        query: text,
                                                        type: "most_fields",
                                                        fields: ["*"]
                                                    }
                                                },
                                                {
                                                    terms: {
                                                        "_id": postIds
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    size: 30
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        hits = response.hits.hits;
                        data = hits.map(function (item) { return item._source; });
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SearchService.prototype.searchPostsIdsByTextFromComments = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var response, comments, postIds, uniqueIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.elasticSearchService.search({
                            index: this.commentIndex,
                            body: {
                                query: {
                                    multi_match: {
                                        query: "*" + text + "*",
                                        operator: "and",
                                        fuzziness: "AUTO",
                                        type: "most_fields"
                                    }
                                },
                                size: 30
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        comments = response.hits.hits.map(function (item) { return item._source; });
                        postIds = comments.map(function (comment) { return comment.post_id.toString(); });
                        uniqueIds = Array.from(new Set(postIds));
                        return [2 /*return*/, uniqueIds];
                }
            });
        });
    };
    SearchService = __decorate([
        common_1.Injectable()
    ], SearchService);
    return SearchService;
}());
exports.SearchService = SearchService;
