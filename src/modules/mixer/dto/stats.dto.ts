import { MixerConfigDto } from './config.dto';

export class MixerStatsResponseDto {
  availableDumpWallets: number;
  defaultConfig: MixerConfigDto;
  supportedFeatures: string[];
}