import redis from "redis";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Message } from "kafkajs";

export const getFeed = async(req: Request, res: Response)=>{
    var user = req.user;
    // for every tweet receives from kafka
    // run a query to find list of follower of author of that tweet 
    // save that to redis cache 
    console.log("success");
    res.status(200);
}

export const createPostHandler = async(message : Message)=>{
    console.log(message);
}