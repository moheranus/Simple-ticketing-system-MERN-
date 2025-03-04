const express = require("express");
const Ticket = require("../models/Ticket");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Ticket (User creates a ticket) - Unchanged
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    const ticket = new Ticket({
      title,
      description,
      priority: priority || "Medium",
      user: req.user.userId,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Tickets (Unchanged)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let tickets;
    if (req.user.role === "admin") {
      tickets = await Ticket.find();
    } else if (req.user.role === "agent") {
      tickets = await Ticket.find({ assignedTo: req.user.userId });
    } else {
      tickets = await Ticket.find({ user: req.user.userId });
    }
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// New Endpoint: Get Tickets Assigned to a Specific Agent
router.get("/assignedTo/:agentId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.userId !== req.params.agentId) {
      return res.status(403).json({ message: "Access denied" });
    }
    const tickets = await Ticket.find({ assignedTo: req.params.agentId });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching assigned tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Ticket (Admins and Agents) - Unchanged
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "agent") {
      return res.status(403).json({ message: "Access Denied. Admin or Agent only" });
    }
    const { status, assignedTo, priority, comment } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    if (req.user.role === "agent" && ticket.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Agents can only update their assigned tickets" });
    }
    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (priority) ticket.priority = priority;
    if (comment) {
      ticket.comments.push({
        user: req.user.userId,
        text: comment,
      });
    }
    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// New Endpoint: Add Comment (Agents and Users)
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    // Agents can comment on their assigned tickets, users on their own tickets
    if (
      (req.user.role === "agent" && ticket.assignedTo.toString() !== req.user.userId) ||
      (req.user.role === "user" && ticket.user.toString() !== req.user.userId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    ticket.comments.push({
      user: req.user.userId,
      text,
    });
    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;