//B"H
const crypto = require('crypto');
class AwtsmoosPush {
  constructor() {

  }
  setVapidDetails(
    website,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  ) {
    this.website = website;
    this.VAPID_PUBLIC_KEY = VAPID_PUBLIC_KEY;
    this.VAPID_PRIVATE_KEY = VAPID_PRIVATE_KEY;
  }

  async sendNotification(subscription, payload, options) {
    
  }
  async makeJWS(subscription) {
    var {endpoint, keys} = subscription;
    var {p256dh} = keys;
    var header = {
      "typ": "JWT",
      "alg": "ES256"
    }

    var payload = {
      "aud": (new URL(endpoint)).origin,
      "exp": Math.floor(Date.now() / 1000) + 12 * 60 * 60,
      "sub": this.website
    }

    var urlSafeH = this.toUrlSafeBase64(header);
    var urlSafePayload = this.toUrlSafeBase64(payload);
    var unsigned = `${urlSafeH}.${urlSafePayload}`
  }

  toUrlSafeBase64(inputString) {
    // Create a buffer from the input string
    const base64Encoded = Buffer.from(inputString).toString('base64');
    
    // Replace the characters for URL safety
    const urlSafeBase64 = base64Encoded
      .replace(/\+/g, '-')  // Replace '+' with '-'
      .replace(/\//g, '_')  // Replace '/' with '_'
      .replace(/=+$/, '');  // Remove trailing '=' padding
    
    return urlSafeBase64;
  }
}


module.exports = AwtsmoosPush;
