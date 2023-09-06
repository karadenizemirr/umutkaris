import { Get, Injectable, Render } from "@nestjs/common";
import { AppDataSource } from "src/customService/mysql.service";
import { Settings } from "src/models/settings.model";

@Injectable()
export class SettingsService {
    private settingsRepository: any;

    constructor() {
        this.settingsRepository = AppDataSource.getRepository(Settings)
    }
    async add_settings(data:any){
        if (data.id){
            // Update
            await this.settingsRepository.update(data.id, data)
            return true
        }else {
            // Add
            const settings = new Settings()
            settings.name = data.name
            settings.token = data.token
            settings.openai_key = data.openai_key
            await this.settingsRepository.save(settings)

            return true
        }
    }

    async get_settings(){
        const settings = await this.settingsRepository.findOne(
            {
                where: {
                    id : 1
                }
            }
        )
        
        return settings
    }
}