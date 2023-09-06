import { Body, Controller, Get, Param, Post, Render, Res } from "@nestjs/common";
import { Response } from "express";
import { BookService } from "./book.service";

@Controller('book')
export class BookController {
    constructor(private bookService: BookService) {}
    
    @Get()
    @Render('books')
    async get_book(){
        const data = await this.bookService.get_books()
        return {
            title: 'Kitap Ekle',
            data:data
        }
    }

    @Post()
    async post_book(@Body() body:any, @Res() res:Response){
        const result = await this.bookService.add_book(body)

        if (result){
            res.status(200).send('success')
        }

        res.status(400).send('error')
    }

    @Get('delete/:id')
    async delete_book(@Res() res:Response, @Param('id') id:number){
        await this.bookService.delete_books(id)

        res.redirect(302, '/book')
    }
}