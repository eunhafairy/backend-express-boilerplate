import express from 'express';
const route = express.Router();

route.get('/', (req, res) => {
    res.send("Hello World from my first route!")
})

export default route;