import { Controller } from "./modules/@core/decorators/controller.decorator";
import { Serializable } from "./modules/@core/decorators/serializable.decorator";
import { Body, Get, Patch } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { UpdateAppDto } from "./app.dto";
import { AppEntity } from "./app.entity";
import { AppService } from "./app.service";

@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Serializable(AppEntity)
  @ApiOperation({ summary: "Get app config" })
  @ApiOkResponse({
    description: "App config",
    type: AppEntity,
  })
  async getConfig(): Promise<any> {
    return await this.appService.getConfig();
  }

  @Patch()
  @Serializable(AppEntity)
  @ApiOperation({ summary: "Update app config" })
  @ApiOkResponse({
    description: "App config",
    type: AppEntity,
  })
  async updateConfig(@Body() payload: UpdateAppDto) {
    return await this.appService.update(payload);
  }
}
