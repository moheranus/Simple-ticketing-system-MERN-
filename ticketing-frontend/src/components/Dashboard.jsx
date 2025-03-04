import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { setTickets } from "../redux/ticketSlice";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

class Dashboard extends Component {
  state = {
    title: "",
    description: "",
    loading: false,
    currentPage: 1,
    ticketsPerPage: 3,
    profile: null, // Store user's profile data
    editingProfile: false,
    profileForm: {
      name: "",
      email: "",
      password: "",
    },
  };

  async componentDidMount() {
    try {
      await this.fetchTickets();
      const profileRes = await axios.get(
        `http://localhost:5000/api/users/${this.props.userId}`, // Assumes userId is in Redux
        { headers: { Authorization: `Bearer ${this.props.token}` } }
      );
      this.setState({
        profile: profileRes.data,
        profileForm: {
          name: profileRes.data.name,
          email: profileRes.data.email,
          password: "",
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
      toast.error("Failed to load data");
    }
  }

  fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${this.props.token}` },
      });
      this.props.setTickets(res.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
    }
  };

  handleLogout = () => {
    this.props.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId"); // Assuming userId is stored
    this.props.navigate("/");
    toast.success("Logged out successfully");
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCreateTicket = async () => {
    if (!this.state.title || !this.state.description) {
      toast.error("Please fill in all fields");
      return;
    }

    this.setState({ loading: true });
    try {
      await axios.post(
        "http://localhost:5000/api/tickets",
        { title: this.state.title, description: this.state.description },
        { headers: { Authorization: `Bearer ${this.props.token}` } }
      );
      this.setState({ title: "", description: "", loading: false, currentPage: 1 });
      await this.fetchTickets();
      toast.success("Ticket created successfully!");
    } catch (error) {
      console.error("Error creating ticket:", error);
      this.setState({ loading: false });
      toast.error("Failed to create ticket");
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  // Profile Editing Handlers
  toggleEditProfile = () => {
    this.setState((prevState) => ({ editingProfile: !prevState.editingProfile }));
  };

  handleProfileChange = (e) => {
    this.setState({
      profileForm: { ...this.state.profileForm, [e.target.name]: e.target.value },
    });
  };

  handleProfileUpdate = async () => {
    try {
      const { name, email, password } = this.state.profileForm;
      const updateData = { name, email };
      if (password) updateData.password = password;

      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        updateData,
        { headers: { Authorization: `Bearer ${this.props.token}` } }
      );

      this.setState({
        profile: res.data,
        editingProfile: false,
        profileForm: { name: res.data.name, email: res.data.email, password: "" },
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile: " + (error.response?.data?.message || error.message));
    }
  };

  render() {
    const { tickets } = this.props;
    const { currentPage, ticketsPerPage, profile, editingProfile, profileForm } = this.state;

    const totalTickets = tickets.length;
    const totalPages = Math.ceil(totalTickets / ticketsPerPage);
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" reverseOrder={false} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl mx-auto flex justify-between items-center bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 relative z-10"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Tickets</h2>
          <div className="relative flex space-x-3">
            {/* Edit Profile Dropdown */}
            <div className="relative">
              <button
                onClick={this.toggleEditProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                {profile ? profile.name : "Profile"}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {editingProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-[1000]"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={this.handleProfileChange}
                        placeholder="Your Name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={this.handleProfileChange}
                        placeholder="Your Email"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password (optional)
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={profileForm.password}
                        onChange={this.handleProfileChange}
                        placeholder="••••••••"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={this.handleProfileUpdate}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={this.toggleEditProfile}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            {/* Logout Button */}
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-200 ease-in-out text-sm sm:text-base"
              onClick={this.handleLogout}
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Main Content: Form and Ticket List Side by Side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-0"
        >
          {/* Ticket Creation Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md h-fit"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Create New Ticket</h3>
            <input
              type="text"
              name="title"
              placeholder="Enter Ticket Title"
              value={this.state.title}
              onChange={this.handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
            <textarea
              name="description"
              placeholder="Describe your issue..."
              value={this.state.description}
              onChange={this.handleInputChange}
              rows="4"
              className="w-full p-3 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
            <button
              onClick={this.handleCreateTicket}
              className={`w-full py-3 rounded-md transition duration-200 ease-in-out text-sm sm:text-base ${
                this.state.loading
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              disabled={this.state.loading}
            >
              {this.state.loading ? "Creating..." : "Submit Ticket"}
            </button>
          </motion.div>

          {/* Ticket List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md h-fit"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Your Tickets</h3>
            {currentTickets.length === 0 ? (
              <p className="text-center text-gray-500 text-sm sm:text-base">No tickets found.</p>
            ) : (
              <>
                <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {currentTickets.map((ticket) => (
                    <motion.li
                      key={ticket._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition duration-200 ease-in-out"
                    >
                      <div className="mb-2 sm:mb-0">
                        <h4 className="font-semibold text-gray-800 text-base sm:text-lg">{ticket.title}</h4>
                        <p className="text-sm text-gray-600">{ticket.description}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium ${
                          ticket.status === "Open"
                            ? "bg-red-100 text-red-800"
                            : ticket.status === "Resolved" || ticket.status === "Closed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </motion.li>
                  ))}
                </ul>
                {totalTickets > ticketsPerPage && (
                  <div className="mt-4 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => this.handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => this.handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets,
  token: state.auth.token,
  userId: state.auth.userId, // Add userId from Redux
});

const mapDispatchToProps = { setTickets, logout };

export default connect(mapStateToProps, mapDispatchToProps)((props) => (
  <Dashboard {...props} navigate={useNavigate()} />
));