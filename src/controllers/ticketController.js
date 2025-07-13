// controllers/ticketController.js

const Ticket = require("../models/Ticket");
const qrcode = require("qrcode");
const transferProof = require("../models/transferProof");

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
      return res.status(401).send({
        message: "Authentication required or email not found in token.",
      });
    }

    // Generate a custom ULID in the format <today's date and time>_<4random_string>
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

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
    return res.status(201).send({
      message: "Ticket registration created successfully",
      data: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    // The aggregation pipeline to join tickets with transfer proofs
    const ticketsWithProofs = await Ticket.aggregate([
      {
        // Stage 1: Perform a left outer join to the 'transferproofs' collection
        $lookup: {
          from: "transferproofs", // The name of the collection for the TransferProof model
          let: { ticket_email: "$email" }, // Define a variable for the ticket's email
          // The pipeline to run on the 'transferproofs' collection for matching
          pipeline: [
            {
              // Match documents in 'transferproofs' based on two conditions
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$email", "$$ticket_email"] }, // Email must match
                    { $eq: ["$type", "ticket"] }, // Type must be 'ticket'
                  ],
                },
              },
            },
            {
              // Optional: Sort proofs by date to get the most recent one if there are multiple
              $sort: { uploadedAt: -1 },
            },
            {
              // Optional: Limit to only the single most recent proof
              $limit: 1,
            },
          ],
          as: "transferProofData", // The array where the matched proof(s) will be stored
        },
      },
      {
        // Stage 2: Deconstruct the 'transferProofData' array.
        // If a ticket has a proof, it will be converted from an array to an object.
        // 'preserveNullAndEmptyArrays' ensures tickets without proofs are still included in the result.
        $unwind: {
          path: "$transferProofData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // Stage 3: Reshape the final output document for the frontend
        $project: {
          _id: 0, // Exclude the default MongoDB '_id'
          ulid: 1,
          name: 1,
          email: 1,
          status: "$status", // The status from the Ticket model
          // Create a new 'transferProof' object that matches the frontend's expectation
          transferProof: {
            filePath: "$transferProofData.filePath",
            status: "$transferProofData.status", // The status from the TransferProof model
          },
        },
      },
    ]);

    // Send the successfully aggregated data with a 200 OK status
    return res.status(200).send(ticketsWithProofs);
  } catch (error) {
    // If any error occurs during the process, log it and send a 500 server error response
    console.error("Error getting all tickets with proofs:", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const updateTicketStatus = async (req, res) => {
  const { email } = req.params; // Assuming update by email for simplicity
  const { status } = req.body; // Expecting the new status in the body

  const statusToBool =
    status === "valid" ? true : status === "invalid" ? false : null;

  try {
    // Update ticket status
    const result = await Ticket.updateOne(
      { email: email },
      { status: statusToBool }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ message: "Ticket not found or status already up to date." });
    }

    // Also update transferproof status if exists
    const newProofStatus = status ? "Valid" : "Invalid";
    await transferProof.updateMany(
      { email: email, type: "ticket" },
      { status: status }
    );

    return res.status(200).send({
      message: "Ticket and transfer proof status updated successfully to",
      newProofStatus,
      data: { email, status },
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const checkTicket = (req, res) => {
  res.status(200).send("GET request to the ticket endpoint is working.");
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
      return res
        .status(404)
        .send({ message: "Ticket not found for this email." });
    }

    let qrCodeDataUrl = null;
    if (ticket.ulid) {
      try {
        // Generate QR Code data URL from the ticket's ULID
        qrCodeDataUrl = await qrcode.toDataURL(ticket.ulid, {
          width: 128,
          margin: 2,
        });
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
      qrCode: qrCodeDataUrl, // Send the QR Code data URL
    });
  } catch (error) {
    console.error("Error getting ticket by email param:", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const createTicketAdmin = async (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).send({ message: "Email is required." });
  }

  try {
    // Generate a custom ULID in the format <today's date and time>_<4random_string>
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const dateTimePart = `${year}${month}${day}_${hours}${minutes}${seconds}`;
    const randomStringPart = Math.random().toString(36).substring(2, 6);
    const customUlid = `${dateTimePart}_${randomStringPart}`;

    const newTicket = {
      ulid: customUlid,
      name: name || "Admin Created Ticket", // Default name if not provided
      email: email,
      status: false,
    };

    await Ticket.create(newTicket);
    return res.status(201).send({
      message: "Ticket created by admin successfully",
      data: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket by admin:", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const scanTicket = async (req, res) => {
  const { ulid } = req.params;
  if (!ulid) {
    return res.status(400).send({ message: "ULID is required." });
  }
  try {
    const ticket = await Ticket.findOne({ ulid: ulid, status: true }); // Assuming 'status: true' means valid ticket
    if (!ticket) {
      return res.status(404).send({ message: "Ticket tidak valid." });
    }
    await Ticket.updateOne(
      { ulid: ulid },
      { status: false } // Mark the ticket as used
    );
    res.status(200).send({ message: "Ticket berhasil digunakan.", ulid });
  } catch (error) {
    console.error("Error scanning ticket:", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketByEmail,
  updateTicketStatus,
  checkTicket,
  createTicketAdmin,
  scanTicket,
};
