import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JitoService } from './jito.service';
import { SendBundleDto } from './dto/send-bundle.dto';
import { BundleStatusDto } from './dto/bundle-status.dto';
import { ProxyRequestDto } from './dto/proxy-request.dto';
import { JitoResponseDto } from './dto/jito-response.dto';

@ApiTags('Jito')
@Controller('api/jito')
export class JitoController {
  constructor(private readonly jitoService: JitoService) {}

  @Post('send-bundle')
  @ApiOperation({ summary: 'Send bundle to Jito block engine' })
  @ApiBody({ type: SendBundleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: JitoResponseDto,
  })
  async sendBundle(@Body() sendBundleDto: SendBundleDto) {
    try {
      const result = await this.jitoService.sendBundle(sendBundleDto.transactions);
      return this.formatResponse(result);
    } catch (error) {
      throw new HttpException(
        this.formatErrorResponse(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('bundle-status/:bundleId')
  @ApiOperation({ summary: 'Get bundle status from Jito' })
  @ApiParam({ name: 'bundleId', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JitoResponseDto,
  })
  async getBundleStatus(@Param() params: BundleStatusDto) {
    try {
      const result = await this.jitoService.getBundleStatus(params.bundleId);
      return this.formatResponse(result);
    } catch (error) {
      throw new HttpException(
        this.formatErrorResponse(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tip-accounts')
  @ApiOperation({ summary: 'Get tip accounts from Jito' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JitoResponseDto,
  })
  async getTipAccounts() {
    try {
      const result = await this.jitoService.getTipAccounts();
      const response = this.formatResponse(result);
      response.currentTipAccount = this.jitoService.getServiceInfo().tipAccount;
      return response;
    } catch (error) {
      throw new HttpException(
        this.formatErrorResponse(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('proxy')
  @ApiOperation({ summary: 'Proxy request to Jito' })
  @ApiBody({ type: ProxyRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JitoResponseDto,
  })
  async proxyRequest(@Body() proxyRequestDto: ProxyRequestDto) {
    try {
      const result = await this.jitoService.proxyRequest(
        proxyRequestDto.method,
        proxyRequestDto.params,
      );
      return this.formatResponse(result);
    } catch (error) {
      throw new HttpException(
        this.formatErrorResponse(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('info')
  @ApiOperation({ summary: 'Get Jito service information' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: JitoResponseDto,
  })
  async getInfo() {
    try {
      return {
        success: true,
        info: this.jitoService.getServiceInfo(),
        message: 'Jito service information retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        this.formatErrorResponse(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private formatResponse(result: any): JitoResponseDto {
    if (result.error) {
      return {
        success: false,
        error: result.error.message || 'Jito request failed',
        jitoError: result.error,
        message: 'Request completed with errors',
      };
    }
    return {
      success: true,
      result: result.result,
      message: 'Request completed successfully',
    };
  }

  private formatErrorResponse(error: any) {
    return {
      success: false,
      error: error.message || 'Internal server error',
      message: 'Request failed',
    };
  }
}