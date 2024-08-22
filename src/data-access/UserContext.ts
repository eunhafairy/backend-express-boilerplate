import { User } from "../entities/User";
import Context from "./BaseContext";
export default class UserContext extends Context<User> {
    constructor() {
        super();
        this.entity = User;
    }

    public async findByEmail(email: string): Promise<User | null> {
        const userRepo = this.getRepository();
        return await userRepo.findOneBy({
            email
        });
    }
}
