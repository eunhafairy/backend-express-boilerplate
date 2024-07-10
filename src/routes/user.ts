import express from 'express';
import { AppDataSource } from '../datasource';
import { User } from '../entities/User';
const route = express.Router();

route.get('/', async (req, res) => {

    const userRespository = AppDataSource.getRepository(User)
    const result = await userRespository.find();

    res.send(result)
})

route.post('/add', async (req, res) => {
    
    try{
        
        const payload = req.body;
        const user = new User()
        user.firstName = payload.firstName;
        user.lastName = payload.lastName;
        user.email = payload.email;
        user.password = payload.password;
        user.username = payload.username;
        user.isActive = payload.isActive;
        user.number = payload.number;

        //get manager
        const userRespository = AppDataSource.getRepository(User)
        const result = await userRespository.save(user);
        console.log("response---", result)
        //add user
        //return response
        res.send("User successfully created!")
    }
    catch(exception){
        console.error("There was an error while creating user!", exception)
        res.sendStatus(500)
    }

})
export default route;