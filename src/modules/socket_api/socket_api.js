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
const logger = require("node-yolog");
const server_1 = require("../server/server");
const hooks_1 = require("../hooks/hooks");
hooks_1.defineHook("socket_api__event_listener");
hooks_1.defineHook("socket_api__get_running_app_list");
class SocketApi {
    defineEventListener() { return this; }
    onRunningApps(socket, args) {
        let running_app_list = hooks_1.invoke("socket_api__get_running_app_list");
        socket.emit("socket_api__running_apps", running_app_list);
    }
    log(socket, args) {
        for (let i in args) {
            logger.info("socket_api__log:", args[i]);
        }
    }
}
__decorate([
    hooks_1.hook("socket_api__event_listener", () => [
        hooks_1.defineHook("socket_api__running_apps"),
        hooks_1.defineHook("socket_api__log")
    ]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SocketApi.prototype, "defineEventListener", null);
__decorate([
    hooks_1.hook("socket_api__running_apps"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SocketApi.prototype, "onRunningApps", null);
__decorate([
    hooks_1.hook("socket_api__log"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SocketApi.prototype, "log", null);
server_1.io.on("connection", function (socket) {
    logger.info("Client connected.");
    let result = hooks_1.invoke("socket_api__event_listener");
    for (let i in result) {
        let event = result[i];
        socket.on(event, (...args) => hooks_1.invoke(event, socket, args));
    }
});
