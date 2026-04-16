require('dotenv').config();

const settings = {
    dbUser: process.env.DB_USER || 'admin',
    dbPassword: process.env.DB_PASSWORD || '',
    paymentGatewayKey: process.env.PAYMENT_GATEWAY_KEY || '',
    smtpUser: process.env.SMTP_USER || '',
    port: parseInt(process.env.PORT, 10) || 3000,
};

module.exports = settings;
