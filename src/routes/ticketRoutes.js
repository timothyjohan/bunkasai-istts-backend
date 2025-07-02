const express = require("express");
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  updateTicketStatus,
  getTicketByEmail,
} = require("../controllers/ticketController");

const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

router.post("/new", authenticateToken, createTicket);
router.get("/", authenticateToken, getAllTickets);
router.put("/:email", authenticateToken, updateTicketStatus);
router.get("/email/:email", authenticateToken, getTicketByEmail);

module.exports = router;
