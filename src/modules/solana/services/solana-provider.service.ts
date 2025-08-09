import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

@Injectable()
export class SolanaProviderService {
  constructor(private readonly configService: ConfigService) {}

  public connection: Connection | null = null;

  public static devRpcUrl = "https://api.devnet.solana.com";
  public static prodRpcUrl = "https://api.mainnet-beta.solana.com";
  // public static prodRpcUrl = "https://api.devnet.solana.com";

  /**
   * Initializes the connection to the Solana cluster
   */
  async onModuleInit() {
    const rpcUrl = this.configService.get("SOLANA_URL");
    const wsEndpoint = this.configService.get("SOLANA_WSS_URL");

    this.connection = new Connection(
      rpcUrl,
      // {
      // commitment: "confirmed",
      // },
      // wsEndpoint && wsEndpoint.length > 10
      //   ? {
      //       wsEndpoint,
      //     }
      //   : undefined,
    );
  }

  get config() {
    const rpcUrl = this.configService.get("SOLANA_URL");
    const wsEndpoint = this.configService.get("SOLANA_WSS_URL");

    return {
      rpcUrl,
      wsEndpoint,
    };
  }

  /**
   * Resets the connection to the Solana cluster
   */
  onModuleDestroy() {
    this.connection = null;
  }

  /**
   * Gets the balance of the wallet
   * @param wallet Id of the wallet
   * @returns
   */
  async getBalance(wallet: string) {
    const publicKey = new PublicKey(wallet);
    const balance = await this.connection!.getBalance(publicKey);

    return balance / LAMPORTS_PER_SOL;
  }
}
