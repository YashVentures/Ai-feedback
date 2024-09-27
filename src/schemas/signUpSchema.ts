import {z } from "zod"

export const usernameValidation = z
  .string()
  .min(2,"username at least 2 charecter")
  .max(20 ,"username must be no more than 20 charecter")
  .regex(/^[a-zA-Z0-9]+$/ ,"username must not contain special charecter")


  export const signUpSchema = z.object({
    username : usernameValidation,
    email: z.string(). email({message:"invalid email address"}),
    password:z.string() . min(6 , {message:"password must be at least 6 charecter"})
    

  })