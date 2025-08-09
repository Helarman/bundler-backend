import { Controller } from "../@core/decorators/controller.decorator";
import { Serializable } from "../@core/decorators/serializable.decorator";
import { Body, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { UpdateDcaAccountDto } from "./dtos/update-dca-account.dto";
import { DcaAccountEntity } from "./entities/dca-order-account.entity";
import { SolanaDcaService } from "./services/solana-dca.service";

@Controller("solana-dca")
export class SolanaDcaController {
  constructor(private service: SolanaDcaService) {}

  @Get("accounts")
  @Serializable(DcaAccountEntity)
  @ApiOperation({
    summary: "Get all solana DCA accounts",
    description:
      "This method returns all solana DCA accounts than created and assigned to the accounts. You can explitly edit some of them",
  })
  @ApiOkResponse({
    description: "Array of solana DCA accounts",
    type: [DcaAccountEntity],
  })
  async getAccounts() {
    return await this.service.getAccounts();
  }

  @Patch("accounts/all")
  @Serializable(DcaAccountEntity)
  @ApiOperation({
    summary: "Update all solana DCA accounts",
    description: "Updates all existing solana DCA accounts with provided data",
  })
  @ApiOkResponse({
    description: "Updated solana DCA accounts",
    type: [DcaAccountEntity],
  })
  async updateAllAccounts(@Body() payload: UpdateDcaAccountDto) {
    return await this.service.updateAllAccounts(payload);
  }

  @Patch("accounts/:id")
  @Serializable(DcaAccountEntity)
  @ApiOperation({
    summary: "Update solana DCA account",
    description: "This method updates solana DCA account",
  })
  @ApiOkResponse({
    description: "Updated solana DCA account",
    type: DcaAccountEntity,
  })
  async updateAccount(
    @Param("id") id: string,
    @Body() payload: UpdateDcaAccountDto,
  ) {
    return await this.service.updateAccount(id, payload);
  }

  @Post("on")
  @ApiOperation({
    summary: "Activate all solana DCA accounts",
    description: "This method activates all solana DCA accounts",
  })
  @ApiOkResponse({
    description: "Activated solana DCA accounts",
    type: [DcaAccountEntity],
  })
  async turnOnAllAccounts() {
    return await this.service.updateAllAccounts({
      isActive: true,
    });
  }

  @Delete("off")
  @ApiOperation({
    summary: "Deactivate all solana DCA accounts",
    description: "This method deactivates all solana DCA accounts",
  })
  @ApiOkResponse({
    description: "Deactivated solana DCA accounts",
    type: [DcaAccountEntity],
  })
  async turnOffAllAccounts() {
    return await this.service.updateAllAccounts({
      isActive: false,
    });
  }
}
