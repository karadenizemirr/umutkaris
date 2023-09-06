import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string

    @Column()
    delay:string

    @CreateDateColumn()
    created_at: Date
}