import { NextFunction, Response, Request } from 'express';

export function cors(_req: Request, res: Response, next: NextFunction) {
    //Uncomment if needed
    //res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Methods', '*');
    //res.setHeader('Access-Control-Allow-Headers', '*');
    next();
}
