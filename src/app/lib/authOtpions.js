import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDb } from "../config/db"
import { User } from "../model/user";
import bcrypt from "bcrypt"

export const authOtpions = {
      providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name:"credentials",
      credentials:{
        username:{label:"Username", type:"text"},
        password:{label:"Password", type:"password"}
      },
      async function(credentials){

        try{
          if(!credentials.username || !credentials.password) throw new Error("all fields must be filled");

          await connectDb();

          const user = await User.findOne({username});
          if(!user) throw new Error("user not found");

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if(!isValid) throw new Error("invalid password");

          return {
            _id:user._id.toString(),
            email:user.email
          }

        }catch(error){
          console.log("error while login : ",error);
          throw Error("somethind went wrond while logining")
        }
      }
    })
  ],
  callbacks:{
    async jwt({token, user}){
      if(user){
        token.id = user.id
      }
      return token
    },
    async session({session, token}){
      if(session.user){
        session.user.id = token.id
      }
      return session
    }
  },
  pages:{
    signin:"/login",
    error:"/login"
  },
  session:{
    strategy:"jwt",
    maxAge:30 * 24 * 60 * 60
  },
  secret:process.env.NEXTAUTH_SECRET
}