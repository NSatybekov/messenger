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
exports.SearchController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var SearchController = /** @class */ (function () {
    function SearchController(searchService) {
        this.searchService = searchService;
    }
    SearchController.prototype.searchInfo = function (body) {
        return this.searchService.search(body.text);
    };
    SearchController.prototype.reindexData = function () {
        return this.searchService.reindexData();
    };
    SearchController.prototype.reindexComments = function () {
        return this.searchService.reindexComments();
    };
    __decorate([
        common_1.Post(),
        __param(0, common_1.Body())
    ], SearchController.prototype, "searchInfo");
    __decorate([
        common_1.Post('reindex')
    ], SearchController.prototype, "reindexData");
    __decorate([
        common_1.Post('reindexComments')
    ], SearchController.prototype, "reindexComments");
    SearchController = __decorate([
        swagger_1.ApiBearerAuth(),
        common_1.Controller('search')
    ], SearchController);
    return SearchController;
}());
exports.SearchController = SearchController;
