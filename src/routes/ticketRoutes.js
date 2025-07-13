const express = require("express");
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  updateTicketStatus,
  getTicketByEmail,
  createTicketAdmin,
  scanTicket,
} = require("../controllers/ticketController");

const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

router.post("/new", authenticateToken, createTicket);
router.post("/admin/new", authenticateToken, authorizeAdmin, createTicketAdmin);
router.get("/", authenticateToken, getAllTickets);
router.put("/:email", authenticateToken, updateTicketStatus);
router.get("/email/:email", authenticateToken, getTicketByEmail);
router.get("/scan/:ulid", authenticateToken, scanTicket);

module.exports = router;
