# jwt-authentication-nodejs



# make ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
    node
    require('crypto').randomBytes(64).toString('hex')
