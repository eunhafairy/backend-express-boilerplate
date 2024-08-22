import { EntityManager, EntitySchema, EntityTarget, getRepository, ObjectLiteral, Repository } from "typeorm";
import { AppDataSource } from "../datasource";

export default class Context<E extends ObjectLiteral> {

    protected entity!: EntityTarget<E>

    constructor(){
        
    }

    public getRepository(){
        return AppDataSource.getRepository<E>(this.entity);
    }

    public async insert(e: E) : Promise<E> {
        const repository = this.getRepository()
        return await repository.save(e)
    }


}