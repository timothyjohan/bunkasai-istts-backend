const express = require("express");
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  updateTicketStatus,
} = require("../controllers/ticketController");

const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

router.post("/new", authenticateToken, createTicket);
router.get("/", authenticateToken, getAllTickets);
router.get("/:email", authenticateToken, updateTicketStatus);

module.exports = router;
