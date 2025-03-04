const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who created the ticket
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user (agent) assigned to the ticket
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The user who added the comment
        text: { type: String, required: true }, // Comment text
        createdAt: { type: Date, default: Date.now }, // Comment creation time
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Ticket", TicketSchema);
