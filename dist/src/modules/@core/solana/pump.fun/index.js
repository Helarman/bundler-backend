"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpFun = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const __1 = require("..");
const globalAccount_1 = require("../globalAccount");
const index_idl_1 = require("./index.idl");
const common_1 = require("@nestjs/common");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = require("bn.js");
class PumpFun {
    constructor(connection) {
        this.connection = connection;
    }
    /**
     * Finds the associated token address for a given wallet address and token address.
     * @param {PublicKey} walletAddress - The wallet address.
     * @param {PublicKey} tokenAddress - The token address.
     * @returns {Promise<PublicKey>} - The associated token address.
     */
    async findAssociatedTokenAddress(walletAddress, tokenAddress) {
        const result = web3_js_1.PublicKey.findProgramAddressSync([
            walletAddress.toBuffer(),
            spl_token_1.TOKEN_PROGRAM_ID.toBuffer(),
            tokenAddress.toBuffer(),
        ], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
        return result?.[0] ?? null;
    }
    static getMintBondingCurve(mint) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("bonding-curve"), mint.toBuffer()], new web3_js_1.PublicKey(PumpFun.programId))[0];
    }
    static getMintMetadata(mint) {
        const mplTokenMetadata = new web3_js_1.PublicKey(__1.Solana.mplTokenMetadataProgramId);
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("metadata"), mplTokenMetadata.toBuffer(), mint.toBuffer()], mplTokenMetadata)[0];
    }
    static async putTokenMetadata(metadata, file) {
        const formData = new FormData();
        formData.append("file", new Blob([file.buffer])),
            formData.append("name", metadata.name),
            formData.append("symbol", metadata.symbol),
            formData.append("description", metadata.description),
            formData.append("twitter", metadata.twitter || ""),
            formData.append("telegram", metadata.telegram || ""),
            formData.append("website", metadata.website || ""),
            formData.append("showName", "true");
        const result = await (await fetch("https://pump.fun/api/ipfs", {
            method: "POST",
            body: formData,
        })).json();
        return result.metadataUri;
    }
    /**
     * Creates create token instruction
     * @param creator Creator of the token
     * @param mint Mint of the token
     * @returns
     */
    static async createTokenInstruction(provider, creator, mint, bondingCurve, name, symbol, metadataUri) {
        const program = new anchor_1.Program(index_idl_1.pumpFunIDL, PumpFun.programId, provider);
        const mintAuthorityId = "TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM";
        const mintAuthority = new web3_js_1.PublicKey(mintAuthorityId);
        const associatedBondingCurve = (0, spl_token_1.getAssociatedTokenAddressSync)(mint.publicKey, bondingCurve, true);
        const mplTokenMetadata = new web3_js_1.PublicKey(__1.Solana.mplTokenMetadataProgramId);
        const metadata = this.getMintMetadata(mint.publicKey);
        return await program.methods
            .create(name, symbol, metadataUri)
            .accounts({
            global: new web3_js_1.PublicKey(PumpFun.globalId),
            mint: mint.publicKey,
            mintAuthority,
            bondingCurve,
            associatedBondingCurve,
            mplTokenMetadata,
            metadata,
            user: creator.publicKey,
            systemProgram: new web3_js_1.PublicKey(__1.Solana.systemProgramId),
            tokenProgram: new web3_js_1.PublicKey(__1.Solana.tokenProgramId),
            associatedTokenProgram: new web3_js_1.PublicKey(__1.Solana.associatedTokenProgramId),
            rent: new web3_js_1.PublicKey(__1.Solana.rentProgramId),
            eventAuthority: web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], new web3_js_1.PublicKey(PumpFun.programId))[0],
            program: new web3_js_1.PublicKey(PumpFun.programId),
        })
            .instruction();
    }
    static async getGlobalAccount(connection) {
        const [globalAccountPDA] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("global")], new web3_js_1.PublicKey(PumpFun.programId));
        const tokenAccount = await connection.getAccountInfo(globalAccountPDA, "finalized");
        return globalAccount_1.GlobalAccount.fromBuffer(tokenAccount.data);
    }
    static async buyTokenInstruction(provider, buyer, mint, bondingCurve, tokenAmount, spendSolAmount) {
        const wallet = new anchor_1.Wallet(buyer);
        const tokenAccount = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, wallet.publicKey, true);
        const associatedBondingCurve = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, bondingCurve, true);
        const program = new anchor_1.Program(index_idl_1.pumpFunIDL, PumpFun.programId, provider);
        return await program.methods
            .buy(new bn_js_1.BN(Number(tokenAmount)), new bn_js_1.BN(spendSolAmount * web3_js_1.LAMPORTS_PER_SOL))
            .accounts({
            global: new web3_js_1.PublicKey(PumpFun.globalId),
            feeRecipient: new web3_js_1.PublicKey(PumpFun.feeRecipientId),
            // feeRecipient: wallet.publicKey,
            mint,
            bondingCurve,
            associatedBondingCurve,
            associatedUser: tokenAccount,
            user: wallet.publicKey,
            systemProgram: new web3_js_1.PublicKey(__1.Solana.systemProgramId),
            tokenProgram: new web3_js_1.PublicKey(__1.Solana.tokenProgramId),
            rent: new web3_js_1.PublicKey(__1.Solana.rentProgramId),
            eventAuthority: web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], new web3_js_1.PublicKey(PumpFun.programId))[0],
            program: new web3_js_1.PublicKey(PumpFun.programId),
        })
            .instruction();
    }
}
exports.PumpFun = PumpFun;
PumpFun.globalId = "4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf";
PumpFun.programId = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
PumpFun.feeRecipientId = "CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM";
PumpFun.logger = new common_1.Logger("PumpFun");
