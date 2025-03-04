/* eslint-disable no-unused-vars */

import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { setTickets, updateTicket } from "../redux/ticketSlice";
import { logout } from "../redux/authSlice";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "ticketManagement", // Default tab
      sidebarOpen: false, // Sidebar toggle for all screens
      // Ticket Management State
      searchQuery: "",
      statusFilter: "All",
      priorityFilter: "All",
      assignedToFilter: "All",
      agents: [],
      ticketPage: 1,
      ticketsPerPage: 3,
      // User Management State
      users: [],
      editingUser: null,
      editForm: { name: "", email: "", password: "", role: "" },
      userPage: 1,
      usersPerPage: 3,
    };
  }

  async componentDidMount() {
    await this.fetchTickets();
    await this.fetchUsers();
  }

  fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: this.props.token },
      });
      this.props.setTickets(res.data);
      const agentsRes = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: this.props.token },
      });
      const agents = agentsRes.data.filter((user) => user.role === "agent");
      this.setState({ agents });
    } catch (error) {
      console.error("Error fetching tickets or agents:", error);
      toast.error("Failed to fetch tickets or agents");
    }
  };

  fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: this.props.token },
      });
      this.setState({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  toggleSidebar = () => {
    this.setState((prevState) => ({ sidebarOpen: !prevState.sidebarOpen }));
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab, sidebarOpen: false });
  };

  // Pagination Handlers
  handleTicketPageChange = (page) => {
    this.setState({ ticketPage: page });
  };

  handleUserPageChange = (page) => {
    this.setState({ userPage: page });
  };

  // Ticket Management Handlers
  handleSearchChange = (e) => this.setState({ searchQuery: e.target.value });
  handleStatusFilterChange = (e) => this.setState({ statusFilter: e.target.value });
  handlePriorityFilterChange = (e) => this.setState({ priorityFilter: e.target.value });
  handleAssignedToFilterChange = (e) => {
    const agentId = e.target.value;
    this.setState({ assignedToFilter: agentId });
    axios
      .get(agentId === "All" ? "http://localhost:5000/api/tickets" : `http://localhost:5000/api/tickets/assignedTo/${agentId}`, {
        headers: { Authorization: this.props.token },
      })
      .then((res) => {
        this.props.setTickets(res.data);
        toast.success("Tickets filtered successfully");
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
        toast.error("Failed to filter tickets");
      });
  };

  handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tickets/${ticketId}`,
        { status: newStatus },
        { headers: { Authorization: this.props.token } }
      );
      this.props.updateTicket(res.data);
      toast.success("Ticket status updated successfully");
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update ticket status");
    }
  };

  handleAssignTicket = async (ticketId, assignedTo) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tickets/${ticketId}`,
        { assignedTo: assignedTo || null },
        { headers: { Authorization: this.props.token } }
      );
      this.props.updateTicket(res.data);
      toast.success("Ticket assigned successfully");
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast.error("Failed to assign ticket");
    }
  };

  handleUpdatePriority = async (ticketId, newPriority) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tickets/${ticketId}`,
        { priority: newPriority },
        { headers: { Authorization: this.props.token } }
      );
      this.props.updateTicket(res.data);
      toast.success("Ticket priority updated successfully");
    } catch (error) {
      console.error("Error updating ticket priority:", error);
      toast.error("Failed to update ticket priority");
    }
  };

  // User Management Handlers
  handleEditUser = (user) => {
    this.setState({
      editingUser: user._id,
      editForm: { name: user.name, email: user.email, password: "", role: user.role },
    });
  };

  handleEditInputChange = (e) => {
    this.setState({ editForm: { ...this.state.editForm, [e.target.name]: e.target.value } });
  };

  handleUpdateUser = async (userId) => {
    try {
      const { name, email, password, role } = this.state.editForm;
      const updateData = { name, email, role };
      if (password) updateData.password = password;
      await axios.put(`http://localhost:5000/api/users/${userId}`, updateData, {
        headers: { Authorization: this.props.token },
      });
      this.setState({ editingUser: null, editForm: { name: "", email: "", password: "", role: "" } });
      await this.fetchUsers();
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  handleLogout = () => {
    this.props.logout();
    toast.success("Logged out successfully");
  };

  render() {
    const { tickets } = this.props;
    const {
      activeTab,
      sidebarOpen,
      searchQuery,
      statusFilter,
      priorityFilter,
      assignedToFilter,
      agents,
      users,
      editingUser,
      editForm,
      ticketPage,
      ticketsPerPage,
      userPage,
      usersPerPage,
    } = this.state;

    // User Pagination
    const totalUsers = users.length;
    const totalUserPages = Math.ceil(totalUsers / usersPerPage);
    const indexOfLastUser = userPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Ticket Pagination
    const filteredTickets = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;
      const matchesAssignedTo = assignedToFilter === "All" || ticket.assignedTo === assignedToFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo;
    });
    const totalTickets = filteredTickets.length;
    const totalTicketPages = Math.ceil(totalTickets / ticketsPerPage);
    const indexOfLastTicket = ticketPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

    return (
      <div className="min-h-screen bg-gray-50 flex relative">
        {/* Toaster for notifications */}
        <Toaster position="top-right" reverseOrder={false} />

        {/* Sidebar */}
        <motion.div
          initial={{ x: -255 }}
          animate={{ x: sidebarOpen ? 0 : -257 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 border-r-4 border-gray-200"
        >
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
            <button onClick={this.toggleSidebar}>
              <svg className="w-6 h-6 hover:cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="mt-4 flex-1">
            <button
              onClick={() => this.handleTabChange("userManagement")}
              className={`w-full text-left p-4 hover:bg-gray-200 hover:cursor-pointer ${activeTab === "userManagement" ? "bg-gray-100 font-semibold" : ""}`}
            >
              User Management
            </button>
            <button
              onClick={() => this.handleTabChange("ticketManagement")}
              className={`w-full text-left p-4 hover:bg-gray-200 hover:cursor-pointer ${activeTab === "ticketManagement" ? "bg-gray-100 font-semibold" : ""}`}
            >
              Ticket Management
            </button>
          </nav>
          {/* <button onClick={this.handleLogout} className="w-full text-left p-4 text-red-500 hover:bg-red-100 hover:cursor-pointer border-t">
            Logout
          </button> */}
          
<button
onClick={this.handleLogout}
  className="bg-red-100 text-center w-64 h-14 relative text-black text-xl font-semibold group mt-4  hover:cursor-pointer"
  type="button"
>
  <div
    className="bg-red-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[240px] z-10 duration-500 hover:cursor-pointer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      height="25px"
      width="25px"
    >
      <path
        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
        fill="#000000"
      ></path>
      <path
        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
        fill="#000000"
      ></path>
    </svg>
  </div>
  <p class="translate-x-2">Log Out</p>
</button>

        </motion.div>

        {/* Overlay for sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={this.toggleSidebar}></div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Sidebar Toggle Button */}
          <button className="mb-4" onClick={this.toggleSidebar}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* User Management */}
          {activeTab === "userManagement" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <ul className="space-y-4">
                  {currentUsers.map((user) => (
                    <li
                      key={user._id}
                      className="border p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
                    >
                      {editingUser === user._id ? (
                        <div className="w-full">
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={this.handleEditInputChange}
                            placeholder="Name"
                            className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={this.handleEditInputChange}
                            placeholder="Email"
                            className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="password"
                            name="password"
                            value={editForm.password}
                            onChange={this.handleEditInputChange}
                            placeholder="New Password (optional)"
                            className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <select
                            name="role"
                            value={editForm.role}
                            onChange={this.handleEditInputChange}
                            className="w-full p-2 mb-2 border rounded-md"
                          >
                            <option value="user">User</option>
                            <option value="agent">Agent</option>
                            <option value="admin">Admin</option>
                          </select>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => this.handleUpdateUser(user._id)}
                              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => this.setState({ editingUser: null })}
                              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <strong className="text-gray-800">{user.name}</strong> - {user.email}
                            <br />
                            Role: {user.role}
                          </div>
                          <button
                            onClick={() => this.handleEditUser(user)}
                            className="mt-2 sm:mt-0 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                {/* User Pagination */}
                {totalUsers > usersPerPage && (
                  <div className="mt-4 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => this.handleUserPageChange(userPage - 1)}
                      disabled={userPage === 1}
                      className={`px-3 py-1 rounded-md text-sm ${
                        userPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {userPage} of {totalUserPages}
                    </span>
                    <button
                      onClick={() => this.handleUserPageChange(userPage + 1)}
                      disabled={userPage === totalUserPages}
                      className={`px-3 py-1 rounded-md text-sm ${
                        userPage === totalUserPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Ticket Management */}
          {activeTab === "ticketManagement" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ticket Management</h2>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6 space-y-4 sm:space-y-0">
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={this.handleSearchChange}
                    className="p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto flex-1"
                  />
                  <select
                    value={statusFilter}
                    onChange={this.handleStatusFilterChange}
                    className="p-3 border border-gray-200 rounded-md w-full sm:w-auto"
                  >
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <select
                    value={priorityFilter}
                    onChange={this.handlePriorityFilterChange}
                    className="p-3 border border-gray-200 rounded-md w-full sm:w-auto"
                  >
                    <option value="All">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <select
                    value={assignedToFilter}
                    onChange={this.handleAssignedToFilterChange}
                    className="p-3 border border-gray-200 rounded-md w-full sm:w-auto"
                  >
                    <option value="All">All Assigned To</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                <ul className="space-y-4">
                  {currentTickets.map((ticket) => (
                    <li
                      key={ticket._id}
                      className="border p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 hover:bg-gray-100 transition duration-200"
                    >
                      <div className="mb-2 sm:mb-0 flex-1 cursor-pointer" onClick={() => this.handleTicketDetails(ticket._id)}>
                        <strong className="text-gray-800">{ticket.title}</strong> - {ticket.status} - Priority: {ticket.priority}
                        <br />
                        Assigned To: {ticket.assignedTo ? agents.find((a) => a._id === ticket.assignedTo)?.name || "Unknown" : "Not Assigned"}
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <select
                          value={ticket.assignedTo || ""}
                          onChange={(e) => this.handleAssignTicket(ticket._id, e.target.value)}
                          className="p-2 border rounded-md bg-white w-full sm:w-auto"
                        >
                          <option value="">Assign to agent</option>
                          {agents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={ticket.status}
                          onChange={(e) => this.handleUpdateStatus(ticket._id, e.target.value)}
                          className="p-2 border rounded-md bg-white w-full sm:w-auto"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <select
                          value={ticket.priority}
                          onChange={(e) => this.handleUpdatePriority(ticket._id, e.target.value)}
                          className="p-2 border rounded-md bg-white w-full sm:w-auto"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
                {/* Ticket Pagination */}
                {totalTickets > ticketsPerPage && (
                  <div className="mt-4 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => this.handleTicketPageChange(ticketPage - 1)}
                      disabled={ticketPage === 1}
                      className={`px-3 py-1 rounded-md text-sm ${
                        ticketPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {ticketPage} of {totalTicketPages}
                    </span>
                    <button
                      onClick={() => this.handleTicketPageChange(ticketPage + 1)}
                      disabled={ticketPage === totalTicketPages}
                      className={`px-3 py-1 rounded-md text-sm ${
                        ticketPage === totalTicketPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets,
  token: state.auth.token,
});

const mapDispatchToProps = { setTickets, updateTicket, logout };

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);