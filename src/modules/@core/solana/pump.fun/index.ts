import { AnchorProvider, Program, Provider, Wallet } from "@coral-xyz/anchor";
import { Solana } from "..";
import { GlobalAccount } from "../globalAccount";
import { pumpFunIDL } from "./index.idl";
import { Logger } from "@nestjs/common";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { BN } from "bn.js";
import { CreatePumpFunTokenDto } from "../../../solana-token/dtos/create-spl.dto";

export class PumpFun {
  public static globalId = "4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf";
  public static programId = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
  public static feeRecipientId = "CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM";
  public static logger = new Logger("PumpFun");

  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Finds the associated token address for a given wallet address and token address.
   * @param {PublicKey} walletAddress - The wallet address.
   * @param {PublicKey} tokenAddress - The token address.
   * @returns {Promise<PublicKey>} - The associated token address.
   */
  async findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenAddress: PublicKey,
  ): Promise<PublicKey> {
    const result = PublicKey.findProgramAddressSync(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    return result?.[0] ?? null;
  }

  public static getMintBondingCurve(mint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("bonding-curve"), mint.toBuffer()],
      new PublicKey(PumpFun.programId),
    )[0];
  }

  public static getMintMetadata(mint: PublicKey) {
    const mplTokenMetadata = new PublicKey(Solana.mplTokenMetadataProgramId);

    return PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), mplTokenMetadata.toBuffer(), mint.toBuffer()],
      mplTokenMetadata,
    )[0];
  }

  public static async putTokenMetadata(
    metadata: CreatePumpFunTokenDto,
    file: Express.Multer.File,
  ) {
    const formData = new FormData();

    formData.append("file", new Blob([file.buffer as any])),
      formData.append("name", metadata.name),
      formData.append("symbol", metadata.symbol),
      formData.append("description", metadata.description),
      formData.append("twitter", metadata.twitter || ""),
      formData.append("telegram", metadata.telegram || ""),
      formData.append("website", metadata.website || ""),
      formData.append("showName", "true");

    const result = await (
      await fetch("https://pump.fun/api/ipfs", {
        method: "POST",
        body: formData,
      })
    ).json();

    return (result as { metadataUri: string }).metadataUri;
  }

  /**
   * Creates create token instruction
   * @param creator Creator of the token
   * @param mint Mint of the token
   * @returns
   */
  public static async createTokenInstruction(
    provider: Provider,
    creator: Keypair,
    mint: Keypair,
    bondingCurve: PublicKey,
    name: string,
    symbol: string,
    metadataUri: string,
  ) {
    const program = new Program<typeof pumpFunIDL>(
      pumpFunIDL,
      PumpFun.programId,
      provider,
    );

    const mintAuthorityId = "TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM";
    const mintAuthority = new PublicKey(mintAuthorityId);

    const associatedBondingCurve = getAssociatedTokenAddressSync(
      mint.publicKey,
      bondingCurve,
      true,
    );

    const mplTokenMetadata = new PublicKey(Solana.mplTokenMetadataProgramId);
    const metadata = this.getMintMetadata(mint.publicKey);

    return await program.methods
      .create(name, symbol, metadataUri)
      .accounts({
        global: new PublicKey(PumpFun.globalId),
        mint: mint.publicKey,
        mintAuthority,
        bondingCurve,
        associatedBondingCurve,
        mplTokenMetadata,
        metadata,
        user: creator.publicKey,
        systemProgram: new PublicKey(Solana.systemProgramId),
        tokenProgram: new PublicKey(Solana.tokenProgramId),
        associatedTokenProgram: new PublicKey(Solana.associatedTokenProgramId),
        rent: new PublicKey(Solana.rentProgramId),
        eventAuthority: PublicKey.findProgramAddressSync(
          [Buffer.from("__event_authority")],
          new PublicKey(PumpFun.programId),
        )[0],
        program: new PublicKey(PumpFun.programId),
      })
      .instruction();
  }

  public static async getGlobalAccount(connection: Connection) {
    const [globalAccountPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("global")],
      new PublicKey(PumpFun.programId),
    );

    const tokenAccount = await connection.getAccountInfo(
      globalAccountPDA,
      "finalized",
    );

    return GlobalAccount.fromBuffer(tokenAccount!.data);
  }

  public static async buyTokenInstruction(
    provider: Provider,
    buyer: Keypair,
    mint: PublicKey,
    bondingCurve: PublicKey,
    tokenAmount: number | bigint,
    spendSolAmount: number,
  ) {
    const wallet = new Wallet(buyer);

    const tokenAccount = getAssociatedTokenAddressSync(
      mint,
      wallet.publicKey,
      true,
    );

    const associatedBondingCurve = getAssociatedTokenAddressSync(
      mint,
      bondingCurve,
      true,
    );

    const program = new Program<typeof pumpFunIDL>(
      pumpFunIDL,
      PumpFun.programId,
      provider,
    );

    return await program.methods
      .buy(
        new BN(Number(tokenAmount)),
        new BN(spendSolAmount * LAMPORTS_PER_SOL),
      )
      .accounts({
        global: new PublicKey(PumpFun.globalId),
        feeRecipient: new PublicKey(PumpFun.feeRecipientId),
        // feeRecipient: wallet.publicKey,
        mint,
        bondingCurve,
        associatedBondingCurve,
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
  }
}
