import { EntityTarget, Repository } from "typeorm";
import { AppDataSource } from "../datasource";
import { User } from "../entities/User";
import Context from "./BaseContext";
export default class UserContext extends Context<User> {

    constructor(){
        super();
        this.entity = User;
    }

}