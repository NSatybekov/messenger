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
exports.__esModule = true;
exports.PostsController = void 0;
var common_1 = require("@nestjs/common");
var guard_1 = require("src/auth/guard");
var decorator_1 = require("src/auth/decorator");
var swagger_1 = require("@nestjs/swagger");
var PostsController = /** @class */ (function () {
    function PostsController(postsService, postHandler) {
        this.postsService = postsService;
        this.postHandler = postHandler;
    }
    PostsController.prototype.createPost = function (user, body) {
        var name = body.name, text = body.text;
        return this.postsService.createPost(user, name, text);
    };
    PostsController.prototype.getMyPosts = function (user) {
        return this.postsService.getUserPosts(user.user_id);
    };
    PostsController.prototype.editPost = function (user, post_id, body) {
        var name = body.name, text = body.text;
        return this.postsService.editPostTry(user, post_id, name, text);
    };
    PostsController.prototype.deletePost = function (user, post_id) {
        return this.postsService.deletePost(user, post_id);
    };
    PostsController.prototype.getUsersPosts = function (user, friend_id) {
        return this.postsService.getAnotherUsersPosts(user, friend_id);
    };
    PostsController.prototype.getFeedPosts = function (user) {
        return this.postsService.getFeedPosts(user);
    };
    PostsController.prototype.searchByText = function (user, body) {
        return this.postsService.findPostByText(user, body.text);
    };
    __decorate([
        common_1.UseGuards(guard_1.JwtGuard),
        common_1.Post(),
        __param(0, decorator_1.GetUser()), __param(1, common_1.Body())
    ], PostsController.prototype, "createPost");
    __decorate([
        swagger_1.ApiOperation({ summary: 'Get list of your posts' }),
        common_1.UseGuards(guard_1.JwtGuard),
        common_1.Get(),
        __param(0, decorator_1.GetUser())
    ], PostsController.prototype, "getMyPosts");
    __decorate([
        swagger_1.ApiParam({ name: 'id', description: 'post id' }),
        swagger_1.ApiOperation({ summary: 'Edit post by its id' }),
        common_1.UseGuards(guard_1.JwtGuard),
        common_1.Put(':id'),
        __param(0, decorator_1.GetUser()), __param(1, common_1.Param('id')), __param(2, common_1.Body())
    ], PostsController.prototype, "editPost");
    __decorate([
        swagger_1.ApiParam({ name: 'id', description: 'post id' }),
        swagger_1.ApiOperation({ summary: 'Delete post by its id' }),
        common_1.UseGuards(guard_1.JwtGuard),
        common_1.Delete(':id'),
        __param(0, decorator_1.GetUser()), __param(1, common_1.Param('id'))
    ], PostsController.prototype, "deletePost");
    __decorate([
        swagger_1.ApiParam({ name: 'id', description: 'user id' }),
        swagger_1.ApiOperation({ summary: 'get users post by users id' }),
        common_1.UseGuards(guard_1.JwtGuard),
        common_1.Get('user/:id'),
        __param(0, decorator_1.GetUser()), __param(1, common_1.Param('id'))
    ], PostsController.prototype, "getUsersPosts");
    __decorate([
        swagger_1.ApiOperation({ summary: 'get posts from all users that are your friends or you sent request to them' }),
        common_1.UseGuards(guard_1.JwtGuard),
        common_1.Get('feed'),
        __param(0, decorator_1.GetUser())
    ], PostsController.prototype, "getFeedPosts");
    __decorate([
        common_1.UseGuards(guard_1.JwtGuard),
        common_1.Post('search'),
        __param(0, decorator_1.GetUser()), __param(1, common_1.Body())
    ], PostsController.prototype, "searchByText");
    PostsController = __decorate([
        swagger_1.ApiBearerAuth(),
        swagger_1.ApiTags('posts'),
        common_1.Controller('posts')
    ], PostsController);
    return PostsController;
}());
exports.PostsController = PostsController;
