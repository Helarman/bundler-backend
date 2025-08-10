"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigUpdatedEvent = void 0;
class AppConfigUpdatedEvent {
    constructor(config) {
        this.config = config;
    }
}
exports.AppConfigUpdatedEvent = AppConfigUpdatedEvent;
AppConfigUpdatedEvent.id = "app-config-updated";
