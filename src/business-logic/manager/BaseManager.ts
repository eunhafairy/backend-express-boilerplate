import { ObjectLiteral } from "typeorm";
import Context from "../../data-access/BaseContext";

export default abstract class BaseManager<
    C extends Context<E>,
    E extends ObjectLiteral,
    S
> {
    protected context: C;
    public abstract entityToModelMapper(entities: E): S;

    constructor() {}
}
