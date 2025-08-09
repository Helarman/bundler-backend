import { App } from "@prisma/client";

export class AppConfigUpdatedEvent {
  static readonly id = "app-config-updated";

  constructor(public config: App) {}
}
