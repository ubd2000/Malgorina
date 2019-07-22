


router.post('/smsVerification', (req, res) => {
    const phoneNumber = req.body.phoneNumber;
  
    request({
      method: 'POST',
      json: true,
      uri: `https://api-sens.ncloud.com/v1/sms/services/${process.env.SENS_SERVICEID}/messages`,
      headers: {
        'Content-Type': 'application/json',
        'X-NCP-auth-key': process.env.SENS_ACCESSKEYID,
        'X-NCP-service-secret': process.env.SENS_SERVICESECRET
      },
      body: {
        type: 'sms',
        from: process.env.SENS_SENDNUMBER,
        to: [`${phoneNumber}`],
        content: `WeGoing 인증번호 ${verificationNumber}입니다.`
      }
    });
  
    return res.json({ phoneNumber: phoneNumber });
  }