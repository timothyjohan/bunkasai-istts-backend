// controllers/ticketController.js

const Ticket = require("../models/Ticket");
const qrcode = require('qrcode');

// In a real application, you would require your actual Ticket model here.
// For this example, we'll use a mock object similar to the Jsong reference.
// const Ticket = require("../models/Ticket"); 

// Mock Ticket model for demonstration purposes,
// replace with your actual Mongoose/ORM model.

const createTicket = async (req, res) => {
    // Expecting 'nama_pembeli' from the frontend form.
    // The 'bukti_transfer' is uploaded separately to '/api/transfer-proof/uploadTransferProof'.
    const { nama_pembeli } = req.body; 

    try {
        // Assuming req.user is populated by an authentication middleware
        // (e.g., JWT middleware) which extracts user info including email.
        if (!req.user || !req.user.email) {
            return res.status(401).send({ message: "Authentication required or email not found in token." });
        }

        // Generate a custom ULID in the format <today's date and time>_<4random_string>
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const dateTimePart = `${year}${month}${day}_${hours}${minutes}${seconds}`;
        
        // Generate 4 random alphanumeric characters
        const randomStringPart = Math.random().toString(36).substring(2, 6); // Gets 4 random chars after '0.'

        const customUlid = `${dateTimePart}_${randomStringPart}`;

        const newTicket = {
            ulid: customUlid, // Add the generated custom ULID
            name: nama_pembeli,
            email: req.user.email, // Use email from authenticated user
            status: false, // Initial status, e.g., pending verification
            // You might add a field to link to the uploaded transfer proof here,
            // e.g., transfer_proof_url: req.body.transferProofUrl // if sent from frontend
        };

        await Ticket.create(newTicket); // Use the Ticket model to save the data
        return res.status(201).send({ message: "Ticket registration created successfully", data: newTicket });
    } catch (error) {
        console.error("Error creating ticket:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find(); // Fetch all tickets
        return res.status(200).send(tickets);
    } catch (error) {
        console.error("Error getting all tickets:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};


const updateTicketStatus = async (req, res) => {
    const { email } = req.params; // Assuming update by email for simplicity
    const { status } = req.body; // Expecting the new status in the body

    if (typeof status !== 'boolean') {
        return res.status(400).send({ message: "Invalid status provided. Status must be a boolean." });
    }

    try {
        const result = await Ticket.updateOne(
            { email: email },
            { status: status }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send({ message: "Ticket not found or status already up to date." });
        }
        return res.status(200).send({ message: "Ticket status updated successfully." });
    } catch (error) {
        console.error("Error updating ticket status:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

const checkTicket = (req, res) => {
    res.status(200).send('GET request to the ticket endpoint is working.');
};

const getTicketByEmail = async (req, res) => {
    // Assuming you want to retrieve a ticket by the user's email from params
    const { email } = req.params; 
    
    // Fallback to req.user.email if email is not in params (e.g., from auth middleware)
    const userEmail = email || (req.user ? req.user.email : null); 

    if (!userEmail) {
        return res.status(400).send({ message: "Email parameter is required." });
    }

    try {
        const ticket = await Ticket.findOne({ email: userEmail }); // Find ticket by email
        if (!ticket) {
            return res.status(404).send({ message: "Ticket not found for this email." });
        }

        let qrCodeDataUrl = null;
        if (ticket.ulid) {
            try {
                // Generate QR Code data URL from the ticket's ULID
                qrCodeDataUrl = await qrcode.toDataURL(ticket.ulid, { width: 128, margin: 2 });
            } catch (qrError) {
                console.error("Error generating QR code:", qrError);
                // Continue without QR code if generation fails
            }
        }
        
        // Return selected fields including the generated QR Code data URL
        return res.status(200).send({
            ulid: ticket.ulid,
            nama_pembeli: ticket.nama_pembeli, // Ensure this matches your model field
            email: ticket.email,
            status: ticket.status,
            qrCode: qrCodeDataUrl // Send the QR Code data URL
        });
    } catch (error) {
        console.error("Error getting ticket by email param:", error);
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketByEmail,
    updateTicketStatus,
    checkTicket,
};
