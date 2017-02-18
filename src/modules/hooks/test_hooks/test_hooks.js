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
const hooks_1 = require("../hooks");
hooks_1.defineHook("my_hook");
class TestHooks {
    constructor() {
        this.test = "test property private";
        this.test2 = "test property public";
    }
    ;
    static getInstance() {
        if (!TestHooks.instance) {
            TestHooks.instance = new TestHooks();
        }
        return TestHooks.instance;
    }
    handleMyHook(a1, a2) {
        console.log(a1, a2);
    }
    handleMyHookWithContext(a1, a2) {
        console.log(a1, a2, this.test, this.test2);
    }
}
__decorate([
    hooks_1.hook("my_hook"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TestHooks.prototype, "handleMyHook", null);
__decorate([
    hooks_1.hook("my_hook", () => TestHooks.getInstance()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TestHooks.prototype, "handleMyHookWithContext", null);
let test = TestHooks.getInstance();
hooks_1.invoke("my_hook", "arg1", 42);
