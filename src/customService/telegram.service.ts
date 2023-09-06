import { Injectable } from "@nestjs/common";
import TelegramBot = require('node-telegram-bot-api');
import { AppDataSource } from "./mysql.service";
import { Website } from "src/models/website.model";
import { ChatgptService } from "./chatgpt.service";
import { Settings } from "src/models/settings.model";
import { Book } from "src/models/book.model";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";


@Injectable()
export class TelegramService {
    private bot: TelegramBot;
    private websiteRepository: any
    private bookRepository: any
    private settingsRepository: any

    constructor(
        private chatgptService: ChatgptService) {
        this.initialize();
    }

    private async initialize() {

        const token = "6171892397:AAFs5JRUweIq1QmGBCAeYzNRli-yZjHGHSw"

        this.websiteRepository = AppDataSource.getRepository(Website)
        this.bookRepository = AppDataSource.getRepository(Book)
        this.settingsRepository = AppDataSource.getRepository(Settings)

        this.bot = new TelegramBot(token, { polling: true })
        this.bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id;

            // Get Username
            const username = (await this.bot.getChatMember(chatId, userId)).user.first_name


            const text = msg.text;
            const settings = await this.settingsRepository.findOne({ where: { id: 1 } })

            // Message Control
            const token = settings.openai_key
            const message_control = await this.chatgptService.detector(token, text)

            if (message_control.toLowerCase().includes('true')) {

                this.bot.deleteMessage(chatId, msg.message_id)
                const message = `❌ Mesajınızda uygunsuz bir kelime tespit edildiMesajınız silindi -> ${username}`;
                this.bot.sendMessage(chatId, message);
            }

            if (text.includes('kitap')) {
                const books = await this.bookRepository.find()
                let buttons = []

                for (const book of books) {
                    const title = book.name
                    buttons.push([
                        { text: title, url: book.link },

                    ])
                }

                buttons.push([
                    {
                        text: '📹 Youtube - Slotistan 📹',
                        url: 'https://youtube.com/@slotistan?si=yHqU7kqCmCxXoWqb'
                    },
                ])
                const keyboard = {
                    inline_keyboard: buttons,
                }

                const replyMarkup: any = {
                    reply_markup: JSON.stringify(keyboard),
                }

                this.bot.sendMessage(chatId, `👉 ${username} Kitaplarımız Aşağıda Mevcuttur. 👈`, replyMarkup);
            }

            if (text.includes('site')) {
                const websites = await this.websiteRepository.find()
                let buttons = []

                for (const website of websites) {
                    let title:string = ''

                    if (website.title === 'Onwine'){
                        title = '🔥' + website.icon + ' ' + website.title
                    }else if (website.title === 'MatadorBet'){
                        title = '🔥' + website.icon + ' ' + website.title
                    }

                    title = website.icon + ' ' + website.title

                    buttons.push([
                        { text: title, url: website.link },
                    ])
                }

                const keyboard = {
                    inline_keyboard: buttons,
                };

                const replyMarkup: any = {
                    reply_markup: JSON.stringify(keyboard),
                    parse_mode: 'HTML'
                };

                this.bot.sendMessage(
                    chatId, 
                    `👉 <strong>${username} Güvenilir Sponsorumuz Olan Tüm Sitelerimiz Aşağıda Mevcuttur.\nGönül Rahatlığı ile yatırım yapabilirsiniz. 👈 </strong>`, 
                    replyMarkup)
            }
            const warning_message = `
                Lütfen aşağıdaki maddelerin <underline>YASAK</underline> olduğunu unutmayın\n
                -Küfür, hakaret, ırkçılık ve cinsiyetçilik içeren mesajları atmak
                -Bağlantımız olmayan sitelerden bahsetmek
                -Referans link paylaşmak
                -Başka grupların ve kanalların reklamını yapmak
                -Para istemek ve para göndermek
                -Ürün satışı yapmak
            `

            const delay: number = 7200

            setTimeout(async () => {
                this.bot.sendMessage(chatId, warning_message, { parse_mode: 'HTML' })
            }, delay * 1000)
        })

        this.bot.on('polling_error', (err) => {
            console.log(err)
        })
    }
}