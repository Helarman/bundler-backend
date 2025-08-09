import { Logger } from "@nestjs/common";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export class Solana {
  public static systemProgramId = "11111111111111111111111111111111";
  public static rentProgramId = "SysvarRent111111111111111111111111111111111";
  public static tokenProgramId = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
  public static associatedTokenProgramId =
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
  public static mplTokenMetadataProgramId =
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

  public static logger = new Logger("Solana");

  public static async getWalletTokenAccount(
    wallet: PublicKey,
    token: PublicKey,
  ): Promise<PublicKey | null> {
    try {
      const associatedPublicKey = await getAssociatedTokenAddress(
        token,
        wallet,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      return associatedPublicKey;
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  public static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public static async isBlockhashExpired(
    connection: Connection,
    lastValidHeight: number,
  ) {
    const currentHeight = await connection.getBlockHeight("finalized");
    const isExpired = currentHeight - lastValidHeight > 150;

    return isExpired;
  }

  /**
   * @deprecated
   * Use SolanaService.checkTx instead
   * Use event emitter instead
   */
  public static async checkTx(
    connection: Connection,
    txHash: string,
    variant: "any" | "finalized" | "confirmed" = "any",
  ) {
    const blockhashResponse =
      await connection.getLatestBlockhashAndContext("finalized");
    const lastValidHeight = blockhashResponse.value.lastValidBlockHeight;

    const START_TIME = new Date();
    let hashExpired = false;
    let txSuccess = false;

    while (!hashExpired && !txSuccess) {
      const { value: status } = await connection.getSignatureStatus(txHash);

      // Break loop if transaction has succeeded
      if (
        status &&
        ((variant === "confirmed" &&
          status.confirmationStatus === "confirmed") ||
          (variant === "finalized" &&
            status.confirmationStatus === "finalized") ||
          (variant === "any" &&
            (status.confirmationStatus === "confirmed" ||
              status.confirmationStatus === "finalized")))
      ) {
        txSuccess = true;
        const endTime = new Date();
        const elapsed = (endTime.getTime() - START_TIME.getTime()) / 1000;

        this.logger.log(
          `Transaction ${txHash} succeded. Elapsed time: ${elapsed} seconds.`,
        );

        return true;
      }

      hashExpired = await this.isBlockhashExpired(connection, lastValidHeight);

      // Break loop if blockhash has expired
      if (hashExpired) {
        const endTime = new Date();
        const elapsed = (endTime.getTime() - START_TIME.getTime()) / 1000;

        this.logger.error(
          `Blockhash for transaction ${txHash} has expired. Elapsed time: ${elapsed} seconds.`,
        );

        return false;
      }

      await this.sleep(1500);
    }

    return false;
  }
}
