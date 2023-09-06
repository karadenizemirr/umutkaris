import { Module } from "@nestjs/common";
import { SettingsContoller } from "./settings.controller";
import { SettingsService } from "./settings.service";

@Module({
    controllers: [SettingsContoller],
    providers: [SettingsService]
})
export class SettingsModule {

}