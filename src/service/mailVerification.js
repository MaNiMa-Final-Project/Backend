import nodemailer from 'nodemailer';

let transporter;

// Startet den Mail-Service und konfiguriert den "transporter" mit den Zugangsdaten
export async function startMailService(){
    transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_SENDER, // Die E-Mail-Adresse des Absenders aus der Umgebungsvariable laden
            pass: process.env.EMAIL_SENDER_PW // Das Passwort des Absenders aus der Umgebungsvariable laden
        },
      });
    
    // Überprüft die Verbindungskonfiguration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });
}


// Sendet eine Verifizierungs-E-Mail an den Benutzer mit dem angegebenen Benutzer-E-Mail und dem Verifizierungs-Token
function sendVerificationEmail(userEmail, verificationToken) {
    let mailOptions = {
        from: 'event-calender@outlook.com', // Die E-Mail-Adresse des Absenders
        to: userEmail, // Die E-Mail-Adresse des Empfängers
        subject: 'Please verify your email', // Der Betreff der E-Mail
        html: `<p>Please click on the following link to verify your email: <a href="http://localhost:8080/auth/verify?t=${verificationToken}" target="_blank">Verify Email</a></p>` // Der Inhalt der E-Mail als HTML-Code
      };

      // Sendet die E-Mail über den "transporter"
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

// Exportiert die "sendVerificationEmail"-Funktion als Standard-Exportmodul
export default sendVerificationEmail;