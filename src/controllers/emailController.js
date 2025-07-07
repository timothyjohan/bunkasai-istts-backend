const nodemailer = require("nodemailer");
const qrcode = require("qrcode");
const User = require("../models/User"); // Sesuaikan path ke model Anda
const Ticket = require("../models/Ticket"); // Sesuaikan path ke model Anda

async function sendEmail(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const tickets = await Ticket.find({ email: email });
        if (!tickets.length) {
            return res.status(404).json({ message: "No tickets found for this user" });
        }

        // --- PERUBAHAN DIMULAI DI SINI ---

        // 1. Buat buffer gambar QR code dan siapkan data attachment
        const attachments = await Promise.all(
            tickets.map(async (ticket) => {
                // Buat QR code sebagai buffer, bukan data URL
                const qrCodeBuffer = await qrcode.toBuffer(ticket.ulid);
                const cid = `qr_${ticket.ulid}`; // Buat Content-ID yang unik
                
                return {
                    filename: `${ticket.ulid}.png`,
                    content: qrCodeBuffer,
                    cid: cid, // Content-ID untuk direferensikan di HTML
                };
            })
        );

        // 2. Buat daftar tiket dalam format HTML, sekarang menggunakan CID
        const ticketsHtml = tickets.map((ticket, index) => {
            const cid = attachments[index].cid; // Dapatkan CID yang sesuai
            return `
            <div style="border: 1px solid #4a4a4a; border-radius: 8px; padding: 16px; margin-bottom: 16px; text-align: center;">
                <h3 style="margin: 0; color: #facc15;">Tiket Bunkasai</h3>
                <p style="margin: 8px 0 12px 0; font-size: 14px; color: #d4d4d4;">Nama: ${ticket.name}</p>
                
                <!-- Gunakan src="cid:..." untuk mereferensikan gambar yang dilampirkan -->
                <img src="cid:${cid}" alt="QR Code for ticket ${ticket.ulid}" style="width: 150px; height: 150px; margin: 0 auto; display: block;"/>
                
                <p style="margin-top: 12px; font-family: monospace; font-size: 12px; color: #a3a3a3; word-wrap: break-word;">${ticket.ulid}</p>
            </div>
        `}).join("");

        // 3. Konfigurasi transporter Nodemailer (tetap sama)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "istts.bunkasai@gmail.com",
                pass: "fgou ykvt kcvf rymb" // Gunakan App Password Anda
            }
        });

        // 4. Opsi email dengan template HTML dan attachments
        const mailOptions = {
            from: `"Bunkasai ISTTS" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "E-Ticket Bunkasai Anda",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #e5e5e5; background-color: #1c1c1c; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #262626; border-radius: 12px; padding: 30px; border: 1px solid #404040;">
                        <h1 style="color: #facc15; text-align: center; margin-bottom: 24px;">E-Ticket Bunkasai Anda Telah Terbit!</h1>
                        <p style="font-size: 16px;">Halo ${user.name || ""},</p>
                        <p style="font-size: 16px;">Terima kasih telah melakukan pembelian. Berikut adalah E-Ticket Anda. Silakan tunjukkan QR code di bawah ini kepada panitia di lokasi acara.</p>
                        <hr style="border: none; border-top: 1px solid #4a4a4a; margin: 20px 0;">
                        ${ticketsHtml}
                        <hr style="border: none; border-top: 1px solid #4a4a4a; margin: 20px 0;">
                        <p style="font-size: 14px; text-align: center; color: #a3a3a3;">Sampai jumpa di Bunkasai ISTTS!</p>
                    </div>
                </div>
            `,
            attachments: attachments // Tambahkan array attachments ke opsi email
        };
        
        // --- AKHIR PERUBAHAN ---

        // 5. Kirim email
        await transporter.sendMail(mailOptions);

        res.json({ message: "Tickets sent to email successfully" });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ message: "Error sending email", error: err.message });
    }
}


module.exports = {
  sendEmail
};
