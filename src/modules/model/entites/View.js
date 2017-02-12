"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const typeorm_1 = require("typeorm");
const CommandType_1 = require("./CommandType");
let View = class View {
    constructor() {
        this.commandTypes = [];
        this.commands = [];
        this.applications = [];
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], View.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToMany(type => CommandType_1.CommandType, commandType => commandType.views, {
        cascadeInsert: true,
        cascadeUpdate: true
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], View.prototype, "commandTypes", void 0);
View = __decorate([
    typeorm_1.Entity()
], View);
exports.View = View;
