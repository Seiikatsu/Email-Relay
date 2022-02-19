import { IsString, IsEmail } from "class-validator";

export class SendEmailDto {
    
    @IsString()
    public name: string;
    
    @IsEmail()
    public email: string;
    
    @IsString()
    public subject: string;
    
    @IsString()
    public content: string;
}