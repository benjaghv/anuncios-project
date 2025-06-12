import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { authOptions } from "~/server/auth";


export default NextAuth(authOptions);


