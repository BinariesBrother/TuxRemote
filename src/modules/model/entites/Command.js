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
const View_1 = require("./View");
const Application_1 = require("./Application");
let Command = class Command {
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Command.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Command.prototype, "icon", void 0);
__decorate([
    typeorm_1.ManyToOne(type => View_1.View, view => view.commands),
    __metadata("design:type", View_1.View)
], Command.prototype, "view", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Application_1.Application, application => application.commands),
    __metadata("design:type", Application_1.Application)
], Command.prototype, "application", void 0);
Command = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Index("index_item_sequence", ['name', 'view'], { unique: true })
], Command);
exports.Command = Command;
