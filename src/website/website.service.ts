import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/customService/mysql.service";
import { Website } from "src/models/website.model";

@Injectable()
export class WebsiteService {
    private websiteRepository:any
    constructor() {
        this.websiteRepository = AppDataSource.getRepository(Website)
    }

    async add_website(data:any){
        try{
        
            const website = new Website()
            website.title = data.title
            website.link = data.link

            await this.websiteRepository.save(website)

            return true

        }catch(err){
            console.log(err)
        }
    }

    async get_all(){
        try{
            const websites = await this.websiteRepository.find()
            return websites
        }catch(err){
            console.log(err)
        }
    }

    async delete_by_id(id:number){
        try{
            await this.websiteRepository.delete(id)
            return true
        }catch(err){
            console.log(err)
        }
    }

}