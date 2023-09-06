import { Body, Controller, Get, Param, Post, Render, Res } from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { Response } from "express";

@Controller('website')
export class WebsiteControler {
    constructor(private websiteService: WebsiteService) {}

    @Get()
    @Render('website')
    async get_website(){
        const data = await this.websiteService.get_all()
        console.log(data)
        return {
            title: 'Website Ekle',
            data: data
        }
    }

    @Post()
    async post_website(@Body() data:string, @Res() res:Response){
        const result = await this.websiteService.add_website(data)

        if (result){
            res.status(200).send("success")
        }

        res.status(400).send("error")
    }

    @Get('/delete/:id')
    async delete_website(@Param('id') id:number, @Res() res:Response){
        await this.websiteService.delete_by_id(id)
        res.redirect(302, '/website')

    }
}