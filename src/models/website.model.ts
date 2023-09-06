import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Website {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    link:string

    @Column()
    title: string

    @Column()
    icon:string

    @CreateDateColumn()
    created_at: Date
}