export default class HttpError extends Error{
    
    status: string | number
    constructor(message: string, status: string | number){
        super(message);
        this.status = status;
        this.name = "HttpError";
    }

}