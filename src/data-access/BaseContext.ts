import { EntityTarget, FindOptionsWhere, ObjectLiteral } from "typeorm";
import { AppDataSource } from "../datasource";

export default class Context<E extends ObjectLiteral> {
    protected entity!: EntityTarget<E>;

    constructor() {}

    public getRepository() {
        return AppDataSource.getRepository<E>(this.entity);
    }

    public async insert(e: E): Promise<E> {
        const repository = this.getRepository();
        return await repository.save(e);
    }

    public async find(): Promise<E[]> {
        const repository = this.getRepository();
        return await repository.find();
    }

    public async findBy(where: FindOptionsWhere<E>): Promise<E[]> {
        const repository = this.getRepository();
        return await repository.findBy(where);
    }

    public async findOneBy(where: FindOptionsWhere<E>): Promise<E | null> {
        const repository = this.getRepository();
        return await repository.findOneBy(where);
    }

    public async remove(e: E): Promise<E> {
        const repository = this.getRepository();
        return await repository.remove(e);
    }
}
