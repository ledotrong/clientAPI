
module.exports = {
    'facebookAuth' : {
        'clientID'      : '2294874014137016',
        'clientSecret'  : '21e580a744857af1590cedf87e4d268d',
        'callbackURL'     : 'http://localhost:3000/api/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'googleAuth' : {
        'clientID'         : '163647069051-hk900htr285s2icr1r2sjf1ae1qq9tak.apps.googleusercontent.com',
        'clientSecret'     : 'MISgnNZq0xZXDNsjEWXn4xtG',
        'callbackURL'      : 'http://localhost:3000/auth/google/callback'
    }
};