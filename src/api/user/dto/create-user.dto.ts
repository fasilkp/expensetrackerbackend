export class CreateUserDto {
    name: string;
    email: string;
    monthlyLimit: number;
    image:string | null;
}
