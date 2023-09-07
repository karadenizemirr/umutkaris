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

                    { role: 'user', content: 'Sana gelen metin içerisinde şimdi bahsedeceğim maddelerden birisi varsa bana true döndür. Yoksa false döndür.' },
                    { role: 'user', content: 'Metin içerisinde küfür,hakaret,ırkçılık ve cinsiyetçilik varsa true döndür.' },
                    { role: 'user', content: 'Referans link varsa' },
                    { role: 'user', content: 'Başka grupların ve kanalların reklamı varsa' },
                    { role: 'user', content: 'Para isteyen ya da para göndermek isteyen varsa' },
                    { role: 'user', content: 'ürün satışı varsa' },
                    { role: 'user', content: 'Metin içerisinde arayacakların bunlar. Bunlardan birisi ile karşılaşırsan true değeri döndür.' },
                    { role: 'user', content: 'İşte arama yağacağın metin: ' + text },
                    {role: 'user', content: 'Ancak sen herşeye true döndürüyorsun. Metini tekrar kontrol et.'}

                ],
                model: 'gpt-3.5-turbo-16k'
            }
        )
        
        return response.choices[0].message.content
    }
}