import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    openai_key: string

    @Column()
    token:string
}