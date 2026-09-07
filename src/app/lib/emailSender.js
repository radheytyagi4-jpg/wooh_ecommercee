import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:process.env.USER_EMAIL,
        pass:process.env.USER_PASS
    }
})

export {transporter}