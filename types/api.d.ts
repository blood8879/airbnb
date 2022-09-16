export type SignUpAPIBody = {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    birthday: Date;
};

export type LoginAPIBody = {
    email: string;
    password: string;
    userId: Number;
}