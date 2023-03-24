"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var auth_module_1 = require("./auth/auth.module");
var config_1 = require("@nestjs/config");
var nest_knexjs_1 = require("nest-knexjs");
var users_module_1 = require("./users/users.module");
var message_module_1 = require("./message/message.module");
var chat_module_1 = require("./chat/chat.module");
var swagger_1 = require("@nestjs/swagger");
var chat_member_module_1 = require("./chat_member/chat_member.module");
var redis_module_1 = require("./redis/redis.module");
var friends_module_1 = require("./friends/friends.module");
var posts_module_1 = require("./posts/posts.module");
var comments_module_1 = require("./comments/comments.module");
var alerts_module_1 = require("./alerts/alerts.module");
var kafka_module_1 = require("./kafka/kafka.module");
var knex_config_1 = require("./config/knex.config");
var search_module_1 = require("./search/search.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                nest_knexjs_1.KnexModule.forRoot(knex_config_1.knexConfig),
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
                config_1.ConfigModule.forRoot({
                    isGlobal: true
                }),
                message_module_1.MessageModule,
                chat_module_1.ChatModule,
                chat_member_module_1.ChatMemberModule,
                swagger_1.SwaggerModule,
                friends_module_1.FriendsModule,
                posts_module_1.PostsModule,
                comments_module_1.CommentsModule,
                alerts_module_1.AlertsModule,
                kafka_module_1.KafkaModule,
                search_module_1.SearchModule,
            ], providers: [
                redis_module_1.RedisModule
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
