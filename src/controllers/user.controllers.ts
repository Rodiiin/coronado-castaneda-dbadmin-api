import { Request, Response } from 'express';

// GET /api/users
export const getUsers = (req: Request, res: Response) => {
    

    const user ={
        name:"john",
        lastname: "Doe",
        email:"jodndoe@example.com",
        age: 30,
        active : true,
        subjects:["math", "science", "history"],
        address:{
            street: "123 Main st",
            city: "aAnyTown"
        },
        arregloObjeto:[
            {
                name:"John",
                lastname:"Doe"
            },
            {
                name: "John",
                lastname:"Doe"
            }
        ]  
    };

    res.json({
        "status": "succes",
        "data":{
            "user": user
        }
    })
};


export const getUserById = (req:Request, res:Response) => {
    res.json({
        "status": "succes",
        "data": {
            "id":req.params.id,
            "name": "john"
        }
    });
}