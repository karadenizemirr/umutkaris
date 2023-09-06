import { Body, Controller, Get, Post, Render, Res } from "@nestjs/common";
import { Response } from "express";
import { MessageService } from "./message.service";

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Get()
    @Render('message')
    async get_message(){
        return {
            title: 'Mesajlar'
        }
    }

    @Post()
    async post_message(@Body() data:any, @Res() res:Response){
        const result = await this.messageService.add_message(data)

        if (result){
            res.status(200).send('success')
        }

        res.status(500).send('error')
    }

}