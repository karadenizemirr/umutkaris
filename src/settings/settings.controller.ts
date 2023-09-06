import { Body, Controller, Get, Post, Render, Res } from "@nestjs/common";
import { Response } from "express";
import { SettingsService } from "./settings.service";

@Controller('settings')
export class SettingsContoller {
    constructor(private settingsService: SettingsService) {}

    @Get()
    @Render('settings')
    async get_settings(){
        const settings = await this.settingsService.get_settings()
        return {
            title: 'Ayarlar',
            data: settings
        }
    }

    @Post()
    async post_settings(@Body() data:any, @Res() res:Response){
        await this.settingsService.add_settings(data)
        res.redirect(302, '/settings')
    }
}