"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaggerModule = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var jeton_module_1 = require("../jeton/jeton.module");
var stagger_service_1 = require("./stagger.service");
var stagger_controller_1 = require("./stagger.controller");
var StaggerModule = /** @class */ (function () {
    function StaggerModule() {
    }
    StaggerModule = __decorate([
        (0, common_1.Module)({
            imports: [event_emitter_1.EventEmitterModule.forRoot(), jeton_module_1.JetonModule],
            providers: [stagger_service_1.StaggerService],
            controllers: [stagger_controller_1.StaggerController],
            exports: [stagger_service_1.StaggerService]
        })
    ], StaggerModule);
    return StaggerModule;
}());
exports.StaggerModule = StaggerModule;
