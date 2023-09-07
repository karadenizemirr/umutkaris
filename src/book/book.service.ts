import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/customService/mysql.service";
import { Book } from "src/models/book.model";

@Injectable()
export class BookService {
    private bookRepository:any
    constructor() {
        this.bookRepository = AppDataSource.getRepository(Book)
    }

    async add_book(data:any){
        try{

            const book = new Book()
            book.name = data.name
            book.link = data.link

            await this.bookRepository.save(book)

            return true

        }catch(err){
            
            console.log(err)
        }
    }

    async get_books(){
        try{
            const books = await this.bookRepository.find()
            return books
        }catch(err){
            console.log(err)
        }
    }


    async delete_books(id:number){
        try{
            const book = await this.bookRepository.findOne(
                {
                    where:{
                        id: id
                    }
                }
            )
            await this.bookRepository.remove(book)
            return true
        }catch(err){
            console.log(err)
        }
    }
}