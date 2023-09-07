import { Injectable } from "@nestjs/common";
import TelegramBot = require('node-telegram-bot-api');
import { AppDataSource } from "./mysql.service";
import { Website } from "src/models/website.model";
import { ChatgptService } from "./chatgpt.service";
import { Settings } from "src/models/settings.model";
import { Book } from "src/models/book.model";


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

        const token = "6379898497:AAFPpmBTDQ4KPWECpnHQPpcf6RTr74fzOoA"

        this.websiteRepository = AppDataSource.getRepository(Website)
        this.bookRepository = AppDataSource.getRepository(Book)
        this.settingsRepository = AppDataSource.getRepository(Settings)

        this.bot = new TelegramBot(token, { polling: true })
        this.bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id;

            // Get Username
            const username = (await this.bot.getChatMember(chatId, userId)).user.first_name


            const text = msg.text ||  ''
            const settings = await this.settingsRepository.findOne({ where: { id: 1 } })

            // Message Control
            const token = settings.openai_key
            const message_control = await this.chatgptService.detector(token, text)

            if (message_control.toLowerCase().includes('true')) {

                this.bot.deleteMessage(chatId, msg.message_id)
                const message = `❌ <strong>Mesajınızda uygunsuz bir kelime tespit edildi Mesajınız silindi -> <a href="https://t.me/${userId}" >${username}</a></strong> ❌`;
                this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
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
                        text: 'Instagram - Slotistan',
                        url: 'https://www.instagram.com/slotistann/'
                    },
                    {
                        text: 'Instagram - Slotistan2',
                        url: 'https://www.instagram.com/slotistan2/'
                    },
                    {
                        text: 'Instagram - Slotabim',
                        url: 'https://www.instagram.com/slotabim/'
                    },
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
                    parse_mode: 'HTML'
                }

                this.bot.sendMessage(chatId, `👉 <strong><a href="https://t.me/${userId}" >${username}</a> Kitap ve Sosyal Medya Hesapları Aşağıda Mevcuttur.</strong> 👈`, replyMarkup);
            }

            if (text.includes('site')) {
                const websites = await this.websiteRepository.find()
                let buttons = []
                buttons.push(
                    [
                        {
                            text: websites[0].title, url: websites[0].link
                        }
                    ]
                )

                for (let i = 0; i < websites.length; i += 2) {
                    const website1 = websites[i]
                    const website2 = websites[i + 1]

                    let title1 = '💥' + website1.title + '💥'
                    let title2 = website2 ? '💥' + website2.title + '💥' : '';

                    // if (website1.title === 'Onwine') {
                    //     title1 = '🔥' + title1
                    // } else if (website1.title === 'MatadorBet') {
                    //     title1 = '🔥' + title1
                    // }

                    // if (website2 && website2.title === 'MatadorBet') {
                    //     title2 = '🔥' + title2
                    // }

                    buttons.push([
                        { text: title1, url: website1.link },
                        { text: title2, url: website2 ? website2.link : '' },
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
                    `👉 <strong><a href="https://t.me/${userId}" >${username}</a> Günvediğimiz ve Önerdiğimiz Sitelere Aşağıdaki Linklerden Ulaşabilirsiniz.\n 👈 </strong>`,
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
            return false
        })
    }
}