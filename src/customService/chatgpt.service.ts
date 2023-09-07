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
                    {role: 'user', content:`
                        "${text.toLowerCase()}" bu mesaj içeriğinde "amk" kelimesi dışında bir "küfür", "ırkçılık", "cinsiyetçilik", "reklam" varsa true değerini döndür, yoksa false değerini döndür.
                    `}

                ],
                model: 'gpt-3.5-turbo-16k'
            }
        )
        
        return response.choices[0].message.content
    }
}