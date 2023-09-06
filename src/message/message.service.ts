import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/customService/mysql.service";
import { Message } from "src/models/message.model";

@Injectable()
export class MessageService {
    private messageRepository: any;
    constructor() {
        this.messageRepository = AppDataSource.getRepository(Message)
    }

    async add_message(data:any){
        try{

            const message = new Message()
            message.message = data.message
            message.delay = data.delay
            await this.messageRepository.save(message)

            return true

        }catch(err){
            console.log('Error: MessageService -> add_message -> err', err)
        }
    }

}