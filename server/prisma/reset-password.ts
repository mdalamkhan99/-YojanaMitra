import '../src/load-env.js';
import {PrismaClient} from '@prisma/client';
import argon2 from 'argon2';
import {z} from 'zod';

const input=z.object({email:z.email(),password:z.string().min(12).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/)}).safeParse({email:process.env.RESET_EMAIL,password:process.env.RESET_PASSWORD});
if(!input.success)throw new Error('Set RESET_EMAIL and a strong RESET_PASSWORD (12+ chars, upper/lowercase, number and symbol) in the environment, then rerun.');
const db=new PrismaClient();try{const user=await db.user.update({where:{email:input.data.email.toLowerCase()},data:{passwordHash:await argon2.hash(input.data.password)}});console.log(`Password reset completed for ${user.email}.`)}finally{await db.$disconnect()}
