import { Module } from "@nestjs/common";
import { WebsiteControler } from "./website.controller";
import { WebsiteService } from "./website.service";

@Module({
    controllers: [WebsiteControler],
    providers: [WebsiteService],
})
export class WebsiteModule {}