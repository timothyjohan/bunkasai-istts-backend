// Overview
// TransactionService ini digunakan untuk mengelola operasi terkait transaksi.
// Kelas ini menyediakan metode utilitas seperti pembuatan ID transaksi yang unik
// dan pembuatan dokumen HtransTicket baru dalam basis data.

const crypto = require("crypto");
const HtransTicket = require("../models/HtransTicket");

class TransactionService {
  // generateInvoiceId
  // Metode ini digunakan untuk menghasilkan ID transaksi yang unik.
  // ID transaksi terdiri dari awalan "TR_", timestamp saat ini, dan string heksadesimal acak 8-byte.
  //
  // Timestamp diambil menggunakan Date.now() untuk mendapatkan milidetik saat ini.
  // String heksadesimal acak dihasilkan menggunakan crypto.randomBytes().
  // String heksadesimal ini kemudian diubah menjadi huruf kapital dan dipotong hingga 16 karakter.
  //
  // Contoh penggunaan:
  // const transactionId = TransactionService.generateInvoiceId();
  // console.log(transactionId); // Output: "TR_<timestamp>_<hex>"
  static generateInvoiceId() {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(8);
    const cryptoHex = randomBytes.toString("hex").slice(0, 16).toUpperCase();
    const transactionId = `TR_${timestamp}_${cryptoHex}`;
    return transactionId;
  }

  // generateHtransTicket
  // Metode ini digunakan untuk membuat dokumen HtransTicket baru dalam basis data.
  // Metode ini menerima parameter invoice_id dan name, serta mengatur used_status menjadi false.
  //
  // Parameter:
  // - invoice_id (String): ID dari invoice yang terkait.
  // - name (String): Nama yang terkait dengan tiket.
  //
  // Contoh penggunaan:
  // TransactionService.generateHtransTicket("INV12345", "John Doe");
  static generateHtransTicket(invoice_id, name) {
    HtransTicket.create({
      invoice_id: invoice_id,
      name: name,
      used_status: false,
    });
  }
}

module.exports = TransactionService;

// Kelas ini diekspor sebagai modul 'TransactionService'.
// Modul ini dapat digunakan di bagian lain dari aplikasi untuk
// menghasilkan ID transaksi unik dan membuat dokumen HtransTicket baru dalam basis data.
