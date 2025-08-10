"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solana = void 0;
const common_1 = require("@nestjs/common");
const spl_token_1 = require("@solana/spl-token");
class Solana {
    static async getWalletTokenAccount(wallet, token) {
        try {
            const associatedPublicKey = await (0, spl_token_1.getAssociatedTokenAddress)(token, wallet, true, spl_token_1.TOKEN_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
            return associatedPublicKey;
        }
        catch (error) {
            console.error(error);
        }
        return null;
    }
    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    static async isBlockhashExpired(connection, lastValidHeight) {
        const currentHeight = await connection.getBlockHeight("finalized");
        const isExpired = currentHeight - lastValidHeight > 150;
        return isExpired;
    }
    /**
     * @deprecated
     * Use SolanaService.checkTx instead
     * Use event emitter instead
     */
    static async checkTx(connection, txHash, variant = "any") {
        const blockhashResponse = await connection.getLatestBlockhashAndContext("finalized");
        const lastValidHeight = blockhashResponse.value.lastValidBlockHeight;
        const START_TIME = new Date();
        let hashExpired = false;
        let txSuccess = false;
        while (!hashExpired && !txSuccess) {
            const { value: status } = await connection.getSignatureStatus(txHash);
            // Break loop if transaction has succeeded
            if (status &&
                ((variant === "confirmed" &&
                    status.confirmationStatus === "confirmed") ||
                    (variant === "finalized" &&
                        status.confirmationStatus === "finalized") ||
                    (variant === "any" &&
                        (status.confirmationStatus === "confirmed" ||
                            status.confirmationStatus === "finalized")))) {
                txSuccess = true;
                const endTime = new Date();
                const elapsed = (endTime.getTime() - START_TIME.getTime()) / 1000;
                this.logger.log(`Transaction ${txHash} succeded. Elapsed time: ${elapsed} seconds.`);
                return true;
            }
            hashExpired = await this.isBlockhashExpired(connection, lastValidHeight);
            // Break loop if blockhash has expired
            if (hashExpired) {
                const endTime = new Date();
                const elapsed = (endTime.getTime() - START_TIME.getTime()) / 1000;
                this.logger.error(`Blockhash for transaction ${txHash} has expired. Elapsed time: ${elapsed} seconds.`);
                return false;
            }
            await this.sleep(1500);
        }
        return false;
    }
}
exports.Solana = Solana;
Solana.systemProgramId = "11111111111111111111111111111111";
Solana.rentProgramId = "SysvarRent111111111111111111111111111111111";
Solana.tokenProgramId = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
Solana.associatedTokenProgramId = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
Solana.mplTokenMetadataProgramId = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
Solana.logger = new common_1.Logger("Solana");
