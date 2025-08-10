"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpFunToken = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const solana_1 = require("../../../@core/solana");
const pump_fun_1 = require("../../../@core/solana/pump.fun");
const index_idl_1 = require("./index.idl");
const common_1 = require("@nestjs/common");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const bn_js_1 = require("bn.js");
class PumpFunToken extends pump_fun_1.PumpFun {
    constructor(connection, tokenId, bondingCurve) {
        super(connection);
        this.logger = new common_1.Logger("PumpFunToken");
        this.microlamptorsFee = 15666;
        this.tokenDecimals = null;
        this.tokenId = tokenId;
        this.bondingCurve = bondingCurve;
    }
    /**
     * Convert token amount to SOL amount
     * @param tokenAmount
     * @returns amount of SOL
     */
    async tokenToSolAmount(tokenAmount = 1) {
        const decimals = await this.getDecimals();
        const { virtual_token_reserves, virtual_sol_reserves } = await this.getData();
        const tokenFullAmount = tokenAmount * 10 ** decimals;
        const solAmountPerToken = virtual_sol_reserves / web3_js_1.LAMPORTS_PER_SOL / virtual_token_reserves;
        pump_fun_1.PumpFun.logger.debug(`Converted ${tokenAmount} token amount to ${tokenFullAmount * solAmountPerToken} SOL amount`);
        return tokenFullAmount * solAmountPerToken;
    }
    /**
     * Convert SOL amount to token amount
     * @param solAmount SOL amount to be converted
     * @returns Token amount
     */
    async solToTokenAmount(solAmount = 1) {
        const decimals = await this.getDecimals();
        const { virtual_token_reserves, virtual_sol_reserves } = await this.getData();
        const tokenAmount = (solAmount * web3_js_1.LAMPORTS_PER_SOL * virtual_token_reserves) /
            virtual_sol_reserves /
            10 ** decimals;
        pump_fun_1.PumpFun.logger.debug(`Converted ${solAmount} SOL amount to ${tokenAmount} token amount`);
        return tokenAmount;
    }
    static calculateWithSlippageBuy(amount, basisPoints) {
        return amount + (amount * basisPoints) / 10000n;
    }
    /**
     * Calculate the maximum SOL cost including slippage.
     *
     * @param solAmount - The amount of SOL to be calculated.
     * @param slipPagePercent - The percentage of slippage to be added.
     * @returns The calculated maximum SOL cost.
     */
    calculateMaxSolCost(solAmount, slipPagePercent = 5) {
        const slipPageDecimals = slipPagePercent / 100;
        const maxSolCost = solAmount * (1 + slipPageDecimals);
        pump_fun_1.PumpFun.logger.debug(`Calculated max sol cost ${maxSolCost} for ${solAmount} SOL with slippage ${slipPagePercent}%`);
        return maxSolCost;
    }
    /**
     * Calculate the minimum SOL amount based on the token amount.
     * @deprecated
     * @param tokenAmount That amount of tokens to be calculated.
     * @param slipPagePercent Slippage percentage for the token amount
     * @returns
     */
    async calculateMinSolOutput(tokenAmount, slipPagePercent = 5) {
        const slippageDecimals = slipPagePercent / 100;
        const solAmount = await this.tokenToSolAmount(tokenAmount);
        const minSolOuput = solAmount * (1 - slippageDecimals);
        pump_fun_1.PumpFun.logger.debug(`Calculated min sol output ${minSolOuput} for ${tokenAmount} token amount with slippage ${slipPagePercent}%`);
        return minSolOuput;
    }
    /**
     * Get the SPL balance of the wallet.
     * @param wallet
     * @returns Balance in SPL
     */
    async getSPLBalance(wallet) {
        const tokenAccount = await solana_1.Solana.getWalletTokenAccount(wallet, new web3_js_1.PublicKey(this.tokenId));
        if (!tokenAccount) {
            throw new Error("Associated token account not found");
        }
        const info = await this.connection.getTokenAccountBalance(tokenAccount);
        if (info.value.uiAmount == null)
            throw new Error("No balance found");
        return info.value.uiAmount;
    }
    /**
     * Get the SPL balance percentage of the wallet.
     * @param wallet Wallet to calculate the balance percentage
     * @param percent Percentage to calculate the balance
     * @returns Balance percentage in SPL
     */
    async getSPLBalancePercentage(wallet, percent) {
        const balance = await this.getSPLBalance(wallet.publicKey);
        const percentDecimals = percent / 100;
        const calculatedBalance = balance * percentDecimals;
        pump_fun_1.PumpFun.logger.debug(`Calculated ${calculatedBalance} (${percent}%) of balance for ${balance} SPL`);
        return calculatedBalance;
    }
    async getDecimals() {
        if (!this?.connection)
            return 0;
        if (this.tokenDecimals !== null)
            return this.tokenDecimals;
        this.logger.debug(`Getting decimals for token ${this.tokenId}`);
        const info = await this.connection.getParsedAccountInfo(new web3_js_1.PublicKey(this.tokenId));
        const decimals = info?.value?.data?.parsed?.info?.decimals || 0;
        this.tokenDecimals = decimals;
        return decimals;
    }
    /**
     *
     * @param buyer Buyer keypair
     * @param solAmount Amount of SOL to be bought
     * @param slipPagePercent Slippage percentage for the sol amount
     * @returns
     */
    async buy(buyer, solAmount, slipPagePercent, createAssociatedTokenAccount, priorityMicroLamptorsFee) {
        if (solAmount < 0)
            throw new Error("SOL amount must be positive");
        const wallet = new anchor_1.Wallet(buyer);
        const token = new web3_js_1.PublicKey(this.tokenId);
        const decimals = await this.getDecimals();
        // Get the associated token account for the buyer
        const tokenAccount = await solana_1.Solana.getWalletTokenAccount(wallet.publicKey, token);
        if (!tokenAccount) {
            throw new Error("Associated token account not found");
        }
        const provider = new anchor_1.AnchorProvider(this.connection, wallet, anchor_1.AnchorProvider.defaultOptions());
        (0, anchor_1.setProvider)(provider);
        const program = new anchor_1.Program(index_idl_1.pumpFunIDL, pump_fun_1.PumpFun.programId, provider);
        const tokenAmount = await this.solToTokenAmount(solAmount);
        const spendSolAmount = this.calculateMaxSolCost(solAmount, slipPagePercent);
        const instruction = await program.methods
            .buy(new bn_js_1.BN(tokenAmount * 10 ** decimals), new bn_js_1.BN(spendSolAmount * web3_js_1.LAMPORTS_PER_SOL))
            .accounts({
            global: new web3_js_1.PublicKey(pump_fun_1.PumpFun.globalId),
            feeRecipient: new web3_js_1.PublicKey(pump_fun_1.PumpFun.feeRecipientId),
            mint: token,
            bondingCurve: new web3_js_1.PublicKey(this.bondingCurve.id),
            associatedBondingCurve: new web3_js_1.PublicKey(this.bondingCurve.associatedId),
            associatedUser: tokenAccount,
            user: wallet.publicKey,
            systemProgram: new web3_js_1.PublicKey(solana_1.Solana.systemProgramId),
            tokenProgram: new web3_js_1.PublicKey(solana_1.Solana.tokenProgramId),
            rent: new web3_js_1.PublicKey(solana_1.Solana.rentProgramId),
            eventAuthority: web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], new web3_js_1.PublicKey(pump_fun_1.PumpFun.programId))[0],
            program: new web3_js_1.PublicKey(pump_fun_1.PumpFun.programId),
        })
            .instruction();
        const blockHash = await this.connection.getLatestBlockhash("finalized");
        const instructions = [instruction];
        let budgetUnits = 60000;
        if (createAssociatedTokenAccount) {
            instructions.unshift((0, spl_token_1.createAssociatedTokenAccountIdempotentInstruction)(wallet.publicKey, tokenAccount, wallet.publicKey, token));
            budgetUnits += 25000;
        }
        if (priorityMicroLamptorsFee) {
            instructions.unshift(web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: priorityMicroLamptorsFee,
            }));
        }
        instructions.unshift(web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
            units: budgetUnits,
        }));
        const transaction = new web3_js_1.VersionedTransaction(new web3_js_1.TransactionMessage({
            payerKey: wallet.publicKey,
            recentBlockhash: blockHash.blockhash,
            instructions,
        }).compileToV0Message());
        transaction.sign([wallet.payer]);
        const txHash = await this.connection.sendTransaction(transaction);
        pump_fun_1.PumpFun.logger.debug(`Buying ${tokenAmount} of tokens for ${solAmount} SOL with slippage ${slipPagePercent}% for ${buyer.publicKey.toBase58()}`);
        return txHash;
    }
    async sell(seller, tokenAmount, slipPagePercent, priorityMicroLamptorsFee, precalculatedMinSolOutput) {
        if (tokenAmount < 0)
            throw new Error("Token amount must be positive");
        const wallet = new anchor_1.Wallet(seller);
        const tokenDecimals = await this.getDecimals();
        const token = new web3_js_1.PublicKey(this.tokenId);
        // Get the associated token account for the seller
        const tokenAccount = await solana_1.Solana.getWalletTokenAccount(wallet.publicKey, token);
        if (!tokenAccount) {
            throw new Error("Associated token account not found");
        }
        const provider = new anchor_1.AnchorProvider(this.connection, wallet, anchor_1.AnchorProvider.defaultOptions());
        (0, anchor_1.setProvider)(provider);
        const program = new anchor_1.Program(index_idl_1.pumpFunIDL, pump_fun_1.PumpFun.programId, provider);
        const minSolOutput = precalculatedMinSolOutput ??
            (await this.calculateMinSolOutput(tokenAmount, slipPagePercent));
        const tokenToSell = tokenAmount * 10 ** tokenDecimals;
        const instruction = await program.methods
            .sell(new bn_js_1.BN(tokenToSell), new bn_js_1.BN(minSolOutput * web3_js_1.LAMPORTS_PER_SOL))
            .accounts({
            global: new web3_js_1.PublicKey(pump_fun_1.PumpFun.globalId),
            feeRecipient: new web3_js_1.PublicKey(pump_fun_1.PumpFun.feeRecipientId),
            mint: token,
            bondingCurve: new web3_js_1.PublicKey(this.bondingCurve.id),
            associatedBondingCurve: new web3_js_1.PublicKey(this.bondingCurve.associatedId),
            associatedUser: tokenAccount,
            user: wallet.publicKey,
            systemProgram: new web3_js_1.PublicKey(solana_1.Solana.systemProgramId),
            tokenProgram: new web3_js_1.PublicKey(solana_1.Solana.tokenProgramId),
            rent: new web3_js_1.PublicKey(solana_1.Solana.rentProgramId),
            eventAuthority: web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], new web3_js_1.PublicKey(pump_fun_1.PumpFun.programId))[0],
            program: new web3_js_1.PublicKey(pump_fun_1.PumpFun.programId),
        })
            .instruction();
        const instructions = [instruction];
        const blockHash = await this.connection.getLatestBlockhash("finalized");
        if (priorityMicroLamptorsFee) {
            // Fee instruction
            instructions.unshift(web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: priorityMicroLamptorsFee,
            }));
        }
        // Limit instruction
        instructions.unshift(web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
            units: 80000,
        }));
        const transaction = new web3_js_1.VersionedTransaction(new web3_js_1.TransactionMessage({
            payerKey: wallet.publicKey,
            recentBlockhash: blockHash.blockhash,
            instructions,
        }).compileToV0Message());
        transaction.sign([wallet.payer]);
        const txHash = await this.connection.sendTransaction(transaction);
        pump_fun_1.PumpFun.logger.debug(`Selling ${tokenAmount} SPL tokens of wallet ${seller.publicKey.toBase58()} with slippage ${slipPagePercent}% for minimum ${minSolOutput} SOL`);
        return txHash;
    }
    async transferAllFromManyToOne(feePayer, holders, addressId, priorityMicroLamptorsFee) {
        const decimals = await this.getDecimals();
        const feePayerWallet = new anchor_1.Wallet(feePayer);
        const destinationAccount = await solana_1.Solana.getWalletTokenAccount(new web3_js_1.PublicKey(addressId), new web3_js_1.PublicKey(this.tokenId));
        await this.connection.getAccountInfo(destinationAccount);
        const sourceAccounts = [];
        for (const holder of holders) {
            const amount = await this.getSPLBalance(holder.publicKey);
            const sourceAccount = await solana_1.Solana.getWalletTokenAccount(holder.publicKey, new web3_js_1.PublicKey(this.tokenId));
            if (!sourceAccount) {
                throw Error;
            }
            sourceAccounts.push({
                amount,
                sourceAccount,
                holder,
            });
        }
        const totalAmount = sourceAccounts.reduce((acc, curr) => acc + curr.amount, 0);
        pump_fun_1.PumpFun.logger.debug(`Transferring ${totalAmount} SPL tokens from ${sourceAccounts.length} accounts to ${destinationAccount.toBase58()}`);
        const instructions = [];
        for (const { amount, sourceAccount, holder } of sourceAccounts) {
            instructions.push((0, spl_token_1.createTransferInstruction)(sourceAccount, destinationAccount, holder.publicKey, BigInt(Math.floor(amount * 10 ** decimals))));
        }
        instructions.unshift(web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: priorityMicroLamptorsFee ?? 40000,
        }));
        instructions.unshift(web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
            units: 12000 * sourceAccounts.length,
        }));
        const blockHash = await this.connection.getLatestBlockhash("finalized");
        const transaction = new web3_js_1.VersionedTransaction(new web3_js_1.TransactionMessage({
            payerKey: feePayerWallet.publicKey,
            recentBlockhash: blockHash.blockhash,
            instructions,
        }).compileToV0Message());
        const signers = holders.map((holder) => new anchor_1.Wallet(holder).payer);
        if (!signers.some((signer) => signer.publicKey.toBase58() === feePayerWallet.publicKey.toBase58())) {
            signers.push(feePayerWallet.payer);
        }
        transaction.sign(signers);
        const txHash = await this.connection.sendTransaction(transaction);
        pump_fun_1.PumpFun.logger.debug(`Transaction hash ${txHash}`);
        return txHash;
    }
    async transfer(holder, addressId, amountPercent, priorityMicroLamptorsFee) {
        const amount = await this.getSPLBalancePercentage(holder, amountPercent);
        const blockHash = await this.connection.getLatestBlockhash("finalized");
        const wallet = new anchor_1.Wallet(holder);
        const decimals = await this.getDecimals();
        const sourceAccount = await solana_1.Solana.getWalletTokenAccount(wallet.publicKey, new web3_js_1.PublicKey(this.tokenId));
        const destinationAccount = await solana_1.Solana.getWalletTokenAccount(new web3_js_1.PublicKey(addressId), new web3_js_1.PublicKey(this.tokenId));
        try {
            await this.connection.getAccountInfo(sourceAccount);
            await this.connection.getAccountInfo(destinationAccount);
        }
        catch (error) {
            throw new Error("Source or destination account not found");
        }
        pump_fun_1.PumpFun.logger.debug(`Transferring ${amount} SPL tokens from ${wallet.publicKey.toBase58()} to ${destinationAccount.toBase58()}`);
        const instructions = [
            (0, spl_token_1.createTransferInstruction)(sourceAccount, destinationAccount, wallet.publicKey, BigInt(Math.floor(amount * 10 ** decimals))),
        ];
        if (priorityMicroLamptorsFee) {
            instructions.unshift(web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: priorityMicroLamptorsFee,
            }));
        }
        instructions.unshift(web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
            units: 10000,
        }));
        const transaction = new web3_js_1.VersionedTransaction(new web3_js_1.TransactionMessage({
            payerKey: wallet.publicKey,
            recentBlockhash: blockHash.blockhash,
            instructions,
        }).compileToV0Message());
        transaction.sign([wallet.payer]);
        const txHash = await this.connection.sendTransaction(transaction);
        pump_fun_1.PumpFun.logger.debug(`Transaction hash ${txHash}`);
        return txHash;
    }
    async getData() {
        const response = await axios_1.default.get(`https://frontend-api.pump.fun/coins/${this.tokenId}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
                Accept: "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "If-None-Match": 'W/"41b-5sP6oeDs1tG//az0nj9tRYbL22A"',
                Priority: "u=4",
            },
        });
        const data = response.data;
        const tokenReserves = data.virtual_token_reserves * 1000;
        return {
            ...data,
            solana_price_per_token: data.virtual_sol_reserves / tokenReserves,
            usd_price_per_token: data.usd_market_cap / tokenReserves,
        };
    }
}
exports.PumpFunToken = PumpFunToken;
