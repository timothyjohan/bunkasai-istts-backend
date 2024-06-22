const qrcode = require("qrcode");

class QrService {
  static generateQR = async (text) => {
    try {
      const qr = await qrcode.toDataURL(text, { width: 300, margin: 2 });
      return qr;
    } catch (error) {}
  };
}

module.exports = QrService;
