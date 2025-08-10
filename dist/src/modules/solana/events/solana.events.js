"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaSynchronizeAccountsEvent = exports.SolanaUnhandledTxsEvent = exports.SolanaTxFailedEvent = exports.SolanaTxSuccessEvent = exports.SolanaTxCreatedEvent = void 0;
class SolanaTxCreatedEvent {
    constructor(params) {
        this.params = params;
    }
}
exports.SolanaTxCreatedEvent = SolanaTxCreatedEvent;
SolanaTxCreatedEvent.id = "solana-tx-created";
class SolanaTxSuccessEvent {
    constructor(params) {
        this.params = params;
    }
}
exports.SolanaTxSuccessEvent = SolanaTxSuccessEvent;
SolanaTxSuccessEvent.id = "solana-tx-success";
class SolanaTxFailedEvent {
    constructor(params) {
        this.params = params;
    }
}
exports.SolanaTxFailedEvent = SolanaTxFailedEvent;
SolanaTxFailedEvent.id = "solana-tx-failed";
class SolanaUnhandledTxsEvent {
    constructor(params) {
        this.params = params;
    }
}
exports.SolanaUnhandledTxsEvent = SolanaUnhandledTxsEvent;
SolanaUnhandledTxsEvent.id = "solana-txs-unhandled";
class SolanaSynchronizeAccountsEvent {
    constructor(type) {
        this.type = type;
    }
}
exports.SolanaSynchronizeAccountsEvent = SolanaSynchronizeAccountsEvent;
SolanaSynchronizeAccountsEvent.id = "solana-synchronize-accounts";
