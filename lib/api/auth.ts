import Axios from "axios";
import { UserType } from "../../types/user";
import axios from ".";
import { LoginAPIBody } from "../../types/api";

interface signUpAPIBody {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    birthday: string;
}

export const signupAPI = (body: signUpAPIBody) =>
    Axios.post<UserType>("/api/auth/signup", body);

export const loginAPI = (body: LoginAPIBody) => 
    Axios.post<UserType>("/api/auth/login", body);

// 쿠키의 access_token의 유저 정보 받아오는 api
export const meAPI = () => axios.get<UserType>("/api/auth/me");

// 로그아웃 api
export const logoutAPI = () => Axios.delete("/api/auth/logout");