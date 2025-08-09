import {
  AnchorProvider,
  Program,
  Wallet,
  setProvider,
} from "@coral-xyz/anchor";
import { Solana } from "../../../@core/solana";
import { PumpFun } from "../../../@core/solana/pump.fun";
import { pumpFunIDL } from "./index.idl";
import { Logger } from "@nestjs/common";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import axios from "axios";
import { BN } from "bn.js";

export interface IBondingCurve {
  id: string;
  associatedId: string;
}

export interface ITokenData {
  mint: string;
  name: string;
  symbol: string;
  description: string | null;
  image_uri: string;
  metadata_uri: string;
  twitter: string | null;
  telegram: string | null;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator: string;
  created_timestamp: number;
  raydium_pool: string | null;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  total_supply: number;
  website: string | null;
  show_name: boolean;
  king_of_the_hill_timestamp: number | null;
  market_cap: number;
  reply_count: number;
  last_reply: number;
  nsfw: boolean;
  market_id: string | null;
  inverted: boolean | null;
  username: string;
  profile_image: string;
  usd_market_cap: number;
  solana_price_per_token: number;
  usd_price_per_token: number;
}
export class PumpFunToken extends PumpFun {
  private logger = new Logger("PumpFunToken");
  public tokenId: string;
  public bondingCurve: IBondingCurve;
  public microlamptorsFee: number = 15666;
  public tokenDecimals: number | null = null;

  constructor(
    connection: Connection,
    tokenId: string,
    bondingCurve: IBondingCurve,
  ) {
    super(connection);

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
    const { virtual_token_reserves, virtual_sol_reserves } =
      await this.getData();

    const tokenFullAmount = tokenAmount * 10 ** decimals;
    const solAmountPerToken =
      virtual_sol_reserves / LAMPORTS_PER_SOL / virtual_token_reserves;

    PumpFun.logger.debug(
      `Converted ${tokenAmount} token amount to ${tokenFullAmount * solAmountPerToken} SOL amount`,
    );

    return tokenFullAmount * solAmountPerToken;
  }

  /**
   * Convert SOL amount to token amount
   * @param solAmount SOL amount to be converted
   * @returns Token amount
   */
  async solToTokenAmount(solAmount = 1) {
    const decimals = await this.getDecimals();
    const { virtual_token_reserves, virtual_sol_reserves } =
      await this.getData();

    const tokenAmount =
      (solAmount * LAMPORTS_PER_SOL * virtual_token_reserves) /
      virtual_sol_reserves /
      10 ** decimals;

    PumpFun.logger.debug(
      `Converted ${solAmount} SOL amount to ${tokenAmount} token amount`,
    );

    return tokenAmount;
  }

  public static calculateWithSlippageBuy(amount: bigint, basisPoints: bigint) {
    return amount + (amount * basisPoints) / 10000n;
  }

  /**
   * Calculate the maximum SOL cost including slippage.
   *
   * @param solAmount - The amount of SOL to be calculated.
   * @param slipPagePercent - The percentage of slippage to be added.
   * @returns The calculated maximum SOL cost.
   */
  calculateMaxSolCost(solAmount: number, slipPagePercent = 5) {
    const slipPageDecimals = slipPagePercent / 100;
    const maxSolCost = solAmount * (1 + slipPageDecimals);

    PumpFun.logger.debug(
      `Calculated max sol cost ${maxSolCost} for ${solAmount} SOL with slippage ${slipPagePercent}%`,
    );

    return maxSolCost;
  }

  /**
   * Calculate the minimum SOL amount based on the token amount.
   * @deprecated
   * @param tokenAmount That amount of tokens to be calculated.
   * @param slipPagePercent Slippage percentage for the token amount
   * @returns
   */
  async calculateMinSolOutput(tokenAmount: number, slipPagePercent = 5) {
    const slippageDecimals = slipPagePercent / 100;
    const solAmount = await this.tokenToSolAmount(tokenAmount);

    const minSolOuput = solAmount * (1 - slippageDecimals);

    PumpFun.logger.debug(
      `Calculated min sol output ${minSolOuput} for ${tokenAmount} token amount with slippage ${slipPagePercent}%`,
    );

    return minSolOuput;
  }

  /**
   * Get the SPL balance of the wallet.
   * @param wallet
   * @returns Balance in SPL
   */
  async getSPLBalance(wallet: PublicKey): Promise<number> {
    const tokenAccount = await Solana.getWalletTokenAccount(
      wallet,
      new PublicKey(this.tokenId),
    );

    if (!tokenAccount) {
      throw new Error("Associated token account not found");
    }

    const info = await this.connection.getTokenAccountBalance(tokenAccount);

    if (info.value.uiAmount == null) throw new Error("No balance found");

    return info.value.uiAmount;
  }

  /**
   * Get the SPL balance percentage of the wallet.
   * @param wallet Wallet to calculate the balance percentage
   * @param percent Percentage to calculate the balance
   * @returns Balance percentage in SPL
   */
  async getSPLBalancePercentage(
    wallet: Keypair,
    percent: number,
  ): Promise<number> {
    const balance = await this.getSPLBalance(wallet.publicKey);
    const percentDecimals = percent / 100;

    const calculatedBalance = balance * percentDecimals;

    PumpFun.logger.debug(
      `Calculated ${calculatedBalance} (${percent}%) of balance for ${balance} SPL`,
    );

    return calculatedBalance;
  }

  async getDecimals(): Promise<number> {
    if (!this?.connection) return 0;
    if (this.tokenDecimals !== null) return this.tokenDecimals;

    this.logger.debug(`Getting decimals for token ${this.tokenId}`);

    const info = await this.connection.getParsedAccountInfo(
      new PublicKey(this.tokenId),
    );

    const decimals = (info?.value?.data as any)?.parsed?.info?.decimals || 0;

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
  async buy(
    buyer: Keypair,
    solAmount: number,
    slipPagePercent?: number,
    createAssociatedTokenAccount?: boolean,
    priorityMicroLamptorsFee?: number,
  ): Promise<string> {
    if (solAmount < 0) throw new Error("SOL amount must be positive");

    const wallet = new Wallet(buyer);
    const token = new PublicKey(this.tokenId);
    const decimals = await this.getDecimals();

    // Get the associated token account for the buyer
    const tokenAccount = await Solana.getWalletTokenAccount(
      wallet.publicKey,
      token,
    );

    if (!tokenAccount) {
      throw new Error("Associated token account not found");
    }

    const provider = new AnchorProvider(
      this.connection,
      wallet,
      AnchorProvider.defaultOptions(),
    );

    setProvider(provider);

    const program = new Program<typeof pumpFunIDL>(
      pumpFunIDL,
      PumpFun.programId as any,
      provider as any,
    );

    const tokenAmount = await this.solToTokenAmount(solAmount);
    const spendSolAmount = this.calculateMaxSolCost(solAmount, slipPagePercent);

    const instruction = await program.methods
      .buy(
        new BN(tokenAmount * 10 ** decimals),
        new BN(spendSolAmount * LAMPORTS_PER_SOL),
      )
      .accounts({
        global: new PublicKey(PumpFun.globalId),
        feeRecipient: new PublicKey(PumpFun.feeRecipientId),
        mint: token,
        bondingCurve: new PublicKey(this.bondingCurve.id),
        associatedBondingCurve: new PublicKey(this.bondingCurve.associatedId),
        associatedUser: tokenAccount,
        user: wallet.publicKey,
        systemProgram: new PublicKey(Solana.systemProgramId),
        tokenProgram: new PublicKey(Solana.tokenProgramId),
        rent: new PublicKey(Solana.rentProgramId),
        eventAuthority: PublicKey.findProgramAddressSync(
          [Buffer.from("__event_authority")],
          new PublicKey(PumpFun.programId),
        )[0],
        program: new PublicKey(PumpFun.programId),
      })
      .instruction();

    const blockHash = await this.connection.getLatestBlockhash("finalized");
    const instructions: TransactionInstruction[] = [instruction];

    let budgetUnits = 60000;

    if (createAssociatedTokenAccount) {
      instructions.unshift(
        createAssociatedTokenAccountIdempotentInstruction(
          wallet.publicKey,
          tokenAccount,
          wallet.publicKey,
          token,
        ),
      );

      budgetUnits += 25000;
    }

    if (priorityMicroLamptorsFee) {
      instructions.unshift(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: priorityMicroLamptorsFee,
        }),
      );
    }

    instructions.unshift(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: budgetUnits,
      }),
    );

    const transaction = new VersionedTransaction(
      new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockHash.blockhash,
        instructions,
      }).compileToV0Message(),
    );

    transaction.sign([wallet.payer]);

    const txHash = await this.connection.sendTransaction(transaction);

    PumpFun.logger.debug(
      `Buying ${tokenAmount} of tokens for ${solAmount} SOL with slippage ${slipPagePercent}% for ${buyer.publicKey.toBase58()}`,
    );

    return txHash;
  }

  async sell(
    seller: Keypair,
    tokenAmount: number,
    slipPagePercent?: number,
    priorityMicroLamptorsFee?: number,
    precalculatedMinSolOutput?: number,
  ) {
    if (tokenAmount < 0) throw new Error("Token amount must be positive");

    const wallet = new Wallet(seller);
    const tokenDecimals = await this.getDecimals();
    const token = new PublicKey(this.tokenId);

    // Get the associated token account for the seller
    const tokenAccount = await Solana.getWalletTokenAccount(
      wallet.publicKey,
      token,
    );

    if (!tokenAccount) {
      throw new Error("Associated token account not found");
    }

    const provider = new AnchorProvider(
      this.connection,
      wallet,
      AnchorProvider.defaultOptions(),
    );

    setProvider(provider);

    const program = new Program<typeof pumpFunIDL>(
      pumpFunIDL,
      PumpFun.programId as any,
      provider as any,
    );

    const minSolOutput =
      precalculatedMinSolOutput ??
      (await this.calculateMinSolOutput(tokenAmount, slipPagePercent));

    const tokenToSell = tokenAmount * 10 ** tokenDecimals;

    const instruction = await program.methods
      .sell(new BN(tokenToSell), new BN(minSolOutput * LAMPORTS_PER_SOL))
      .accounts({
        global: new PublicKey(PumpFun.globalId),
        feeRecipient: new PublicKey(PumpFun.feeRecipientId),
        mint: token,
        bondingCurve: new PublicKey(this.bondingCurve.id),
        associatedBondingCurve: new PublicKey(this.bondingCurve.associatedId),
        associatedUser: tokenAccount,
        user: wallet.publicKey,
        systemProgram: new PublicKey(Solana.systemProgramId),
        tokenProgram: new PublicKey(Solana.tokenProgramId),
        rent: new PublicKey(Solana.rentProgramId),
        eventAuthority: PublicKey.findProgramAddressSync(
          [Buffer.from("__event_authority")],
          new PublicKey(PumpFun.programId),
        )[0],
        program: new PublicKey(PumpFun.programId),
      })
      .instruction();

    const instructions: TransactionInstruction[] = [instruction];

    const blockHash = await this.connection.getLatestBlockhash("finalized");

    if (priorityMicroLamptorsFee) {
      // Fee instruction
      instructions.unshift(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: priorityMicroLamptorsFee,
        }),
      );
    }

    // Limit instruction
    instructions.unshift(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 80000,
      }),
    );

    const transaction = new VersionedTransaction(
      new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockHash.blockhash,
        instructions,
      }).compileToV0Message(),
    );

    transaction.sign([wallet.payer]);

    const txHash = await this.connection.sendTransaction(transaction);

    PumpFun.logger.debug(
      `Selling ${tokenAmount} SPL tokens of wallet ${seller.publicKey.toBase58()} with slippage ${slipPagePercent}% for minimum ${minSolOutput} SOL`,
    );

    return txHash;
  }

  async transferAllFromManyToOne(
    feePayer: Keypair,
    holders: Keypair[],
    addressId: string,
    priorityMicroLamptorsFee?: number,
  ) {
    const decimals = await this.getDecimals();
    const feePayerWallet = new Wallet(feePayer);

    const destinationAccount = await Solana.getWalletTokenAccount(
      new PublicKey(addressId),
      new PublicKey(this.tokenId),
    );

    await this.connection.getAccountInfo(destinationAccount!);

    const sourceAccounts: {
      amount: number;
      sourceAccount: PublicKey;
      holder: Keypair;
    }[] = [];

    for (const holder of holders) {
      const amount = await this.getSPLBalance(holder.publicKey);
      const sourceAccount = await Solana.getWalletTokenAccount(
        holder.publicKey,
        new PublicKey(this.tokenId),
      );
      if(!sourceAccount){
        throw Error
      }

      sourceAccounts.push({
        amount,
        sourceAccount,
        holder,
      });
    }

    const totalAmount = sourceAccounts.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );

    PumpFun.logger.debug(
      `Transferring ${totalAmount} SPL tokens from ${sourceAccounts.length} accounts to ${destinationAccount!.toBase58()}`,
    );

    const instructions: TransactionInstruction[] = [];

    for (const { amount, sourceAccount, holder } of sourceAccounts) {
      instructions.push(
        createTransferInstruction(
          sourceAccount,
          destinationAccount!,
          holder.publicKey,
          BigInt(Math.floor(amount * 10 ** decimals)),
        ),
      );
    }

    instructions.unshift(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityMicroLamptorsFee ?? 40000,
      }),
    );

    instructions.unshift(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 12000 * sourceAccounts.length,
      }),
    );

    const blockHash = await this.connection.getLatestBlockhash("finalized");

    const transaction = new VersionedTransaction(
      new TransactionMessage({
        payerKey: feePayerWallet.publicKey,
        recentBlockhash: blockHash.blockhash,
        instructions,
      }).compileToV0Message(),
    );

    const signers = holders.map((holder) => new Wallet(holder).payer);

    if (
      !signers.some(
        (signer) =>
          signer.publicKey.toBase58() === feePayerWallet.publicKey.toBase58(),
      )
    ) {
      signers.push(feePayerWallet.payer);
    }

    transaction.sign(signers);

    const txHash = await this.connection.sendTransaction(transaction);

    PumpFun.logger.debug(`Transaction hash ${txHash}`);

    return txHash;
  }

  async transfer(
    holder: Keypair,
    addressId: string,
    amountPercent: number,
    priorityMicroLamptorsFee?: number,
  ) {
    const amount = await this.getSPLBalancePercentage(holder, amountPercent);
    const blockHash = await this.connection.getLatestBlockhash("finalized");
    const wallet = new Wallet(holder);
    const decimals = await this.getDecimals();

    const sourceAccount = await Solana.getWalletTokenAccount(
      wallet.publicKey,
      new PublicKey(this.tokenId),
    );

    const destinationAccount = await Solana.getWalletTokenAccount(
      new PublicKey(addressId),
      new PublicKey(this.tokenId),
    );

    try {
      await this.connection.getAccountInfo(sourceAccount!);
      await this.connection.getAccountInfo(destinationAccount!);
    } catch (error) {
      throw new Error("Source or destination account not found");
    }

    PumpFun.logger.debug(
      `Transferring ${amount} SPL tokens from ${wallet.publicKey.toBase58()} to ${destinationAccount!.toBase58()}`,
    );

    const instructions: TransactionInstruction[] = [
      createTransferInstruction(
        sourceAccount!,
        destinationAccount!,
        wallet.publicKey,
        BigInt(Math.floor(amount * 10 ** decimals)),
      ),
    ];

    if (priorityMicroLamptorsFee) {
      instructions.unshift(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: priorityMicroLamptorsFee,
        }),
      );
    }

    instructions.unshift(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 10000,
      }),
    );

    const transaction = new VersionedTransaction(
      new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockHash.blockhash,
        instructions,
      }).compileToV0Message(),
    );

    transaction.sign([wallet.payer]);

    const txHash = await this.connection.sendTransaction(transaction);

    PumpFun.logger.debug(`Transaction hash ${txHash}`);

    return txHash;
  }

  async getData() {
    const response = await axios.get<
      Omit<ITokenData, "solana_price_per_token" | "usd_price_per_token">
    >(`https://frontend-api.pump.fun/coins/${this.tokenId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
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
