import nodemailer from 'nodemailer';

// Test ZeptoMail SMTP connection
async function testZeptoMailConnection() {
  console.log('Testing ZeptoMail SMTP connection...\n');
  
  const apiKey = process.env.ZEPTOMAIL_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  
  if (!apiKey) {
    console.error('❌ ZEPTOMAIL_API_KEY is not set');
    process.exit(1);
  }
  
  if (!emailFrom) {
    console.error('❌ EMAIL_FROM is not set');
    process.exit(1);
  }
  
  console.log('✓ Environment variables are set');
  console.log(`  EMAIL_FROM: ${emailFrom}`);
  console.log(`  ZEPTOMAIL_API_KEY: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}\n`);
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.zeptomail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'emailapikey',
      pass: apiKey
    }
  });
  
  try {
    // Verify SMTP connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection successful!\n');
    
    console.log('ZeptoMail credentials are valid and ready to use.');
    process.exit(0);
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. Your ZeptoMail API key is correct');
    console.error('2. Your sender email is verified in ZeptoMail');
    console.error('3. Your ZeptoMail account is active');
    process.exit(1);
  }
}

testZeptoMailConnection();
