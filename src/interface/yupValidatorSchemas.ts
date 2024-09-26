import { object, string, number, date ,array} from 'yup';

// export let userSchema = object({
//     name: string().required(),
//     age: number().required().positive().integer(),
//     email: string().email(),
//     website: string().url().nullable(),
//     createdOn: date().default(() => new Date()),
//   });
  
export const userSchema = object({
    name : string().required(),
    email : string().email().required(),
    password : string().required(),
    profilePic : string().required()
});

export const loginUserSchema = object({
    email : string().email().required(),
    password : string().required(),
});

export const taskSchema = object({
    title : string().required(),
    description : string().required(),
    status : string().required(),
    boardId : string().required(),
    order : number().required()
});