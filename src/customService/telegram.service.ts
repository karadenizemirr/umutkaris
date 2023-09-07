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

            if (text.toLowerCase().includes('kitap')) {
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
                        url: 'https://www.instagram.com/slotistann/',
                    }
                ]);
                
                buttons.push([
                    {
                        text: 'Instagram - Slotistan2',
                        url: 'https://www.instagram.com/slotistan2/'
                    }
                ]);
                
                buttons.push([
                    {
                        text: 'Instagram - Slotabim',
                        url: 'https://www.instagram.com/slotabim/'
                    }
                ]);
                
                buttons.push([
                    {
                        text: 'Youtube - Slotistan',
                        url: 'https://youtube.com/@slotistan?si=yHqU7kqCmCxXoWqb'
                    }
                ]);

                const keyboard = {
                    inline_keyboard: buttons,
                }

                const replyMarkup: any = {
                    reply_markup: JSON.stringify(keyboard),
                    parse_mode: 'HTML'
                }

                this.bot.sendMessage(chatId, `<strong><a href="https://t.me/${userId}" >${username}</a> Kitap ve Sosyal Medya Hesapları Aşağıda Mevcuttur.</strong>`, replyMarkup);
            }

            if (text.toLocaleLowerCase().includes('site')) {
                const websites = await this.websiteRepository.find()
                let buttons = []
                let betSorspinButton = null;

                const metador_text = `🔥 ${websites[0].title || ''} 🔥`
                buttons.push(
                    [
                        {
                            text: metador_text, url: websites[0].link
                        }
                    ]
                )

                for (let i = 1; i < websites.length - 1; i += 2) {
                    let site_1 = websites[i];
                    let site_2 = websites[i + 1];
                
                    if (site_2) {
                        if (site_1.title === "BetOrSpin" || site_2.title === "BetOrSpin") {
                            betSorspinButton = { text: '🔥' + site_1.title + '🔥', url: site_1.link };
                        } else {
                            buttons.push([
                                { text: '💥' + site_1.title + '💥', url: site_1.link },
                                { text: '💥' + site_2.title + '💥', url: site_2.link }
                            ]);
                        }
                    }
                }
                
                if (betSorspinButton) {
                    buttons.push([betSorspinButton]);
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
                    `<strong><a href="https://t.me/${userId}" >${username}</a> Güvendiğimiz ve Önerdiğimiz Sitelere Aşağıdaki Linklerden Ulaşabilirsiniz.</strong>`,
                    replyMarkup)
            }

            const warning_message = `
                <strong>Lütfen aşağıdaki maddelerin <u>YASAK</u> olduğunu unutmayın
                -Küfür, hakaret, ırkçılık ve cinsiyetçilik içeren mesajlar
                -Bağlantımız olmayan sitelerden bahsetmek
                -Referans link paylaşmak
                -Başka grupların ve kanalların reklamını yapmak
                -Para istemek ve para göndermek
                -Ürün satışı yapmak</strong>
            `
            const delay: number = 43200

            setTimeout(async () => {
                this.bot.sendMessage(chatId, warning_message, { parse_mode: 'HTML' })
            }, delay * 1000)
        })

        this.bot.on('polling_error', (err) => {
            return false
        })
    }
}