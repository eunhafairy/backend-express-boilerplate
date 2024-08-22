import { ObjectLiteral } from "typeorm";
import Context from "../../data-access/context/BaseContext";

export default abstract class BaseManager<
    C extends Context<E>,
    E extends ObjectLiteral,
    S
> {
    protected context: C;
    public abstract entityToModelMapper(entity: E): S;

    constructor() {}
}
