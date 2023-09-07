import { Injectable } from "@nestjs/common";
import { OpenAI } from "openai";

@Injectable()
export class ChatgptService {

    private openai: OpenAI

    constructor() { }

    async detector(chatgpt_api_key: string, text: string) {

        this.openai = new OpenAI({
            apiKey: chatgpt_api_key,
        })

        const response = await this.openai.chat.completions.create(
            {
                messages: [
                    {role: 'user', content: 'Sana vereceğim mesajı oku ve aşağıda sana vereceğim adımlara göre mesajı analiz et.'},
                    {role: 'user', content: 'Mesaj küfür, cinsiyetçilik, ırkçılık içeriyorsa true değerini döndür. İçermiyorsa false değerini döndür ve "amk" kelimesi varsa false döndür.'},
                    {role: 'user', content: 'amk kelimesini küfür olarak algılama.'},
                    {role: 'user', content: '"ortak kasa" ifadesi varsa true döndür.'},
                    {role: 'user', content: 'işte analiz yapacağın mesaj: ' + text},

                ],
                model: 'gpt-3.5-turbo-16k'
            }
        )
        
        return response.choices[0].message.content
    }
}