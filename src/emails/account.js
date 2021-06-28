const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "amrit88.b@gmail.com",
        subject: 'Thanks for joining in !!',
        text: `Welcome to the app , ${name}. Let me know how you want to get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'amrit88.b@gmail.com',
        subject: 'Checking up user',
        text: `Are you not satisfied??, ${name}. Please give us your feedbacks`
    })

}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
