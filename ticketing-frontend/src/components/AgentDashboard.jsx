import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { setTickets, updateTicket } from "../redux/ticketSlice";
import { logout } from "../redux/authSlice";

class AgentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      statusFilter: "All",
      profile: null,
      editingProfile: false,
      profileForm: {
        name: "",
        email: "",
        password: "",
      },
    };
  }

  async componentDidMount() {
    try {
      const ticketsRes = await axios.get(
        `http://localhost:5000/api/tickets/assignedTo/${this.props.userId}`,
        { headers: { Authorization: this.props.token } }
      );
      console.log("Fetched tickets for agent:", ticketsRes.data);
      console.log("Agent userId:", this.props.userId);
      this.props.setTickets(ticketsRes.data);

      const profileRes = await axios.get(
        `http://localhost:5000/api/users/${this.props.userId}`,
        { headers: { Authorization: this.props.token } }
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
    }
  }

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleStatusFilterChange = (e) => {
    this.setState({ statusFilter: e.target.value });
  };

  handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tickets/${ticketId}`,
        { status: newStatus },
        { headers: { Authorization: this.props.token } }
      );
      this.props.updateTicket(res.data);
    } catch (error) {
      alert("Failed to update ticket status: " + (error.response?.data?.message || error.message));
    }
  };

  handleLogout = () => {
    this.props.logout();
  };

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
        { headers: { Authorization: this.props.token } }
      );

      this.setState({
        profile: res.data,
        editingProfile: false,
        profileForm: { name: res.data.name, email: res.data.email, password: "" },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile: " + (error.response?.data?.message || error.message));
    }
  };

  render() {
    const filteredTickets = this.props.tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(this.state.searchQuery.toLowerCase());
      const matchesStatus = this.state.statusFilter === "All" || ticket.status === this.state.statusFilter;
      return matchesSearch && matchesStatus;
    });

    const { profile, editingProfile, profileForm } = this.state;

    return (
      <div className="p-5 min-h-screen bg-gray-50">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-2xl font-bold text-gray-800">Agent Dashboard</h2>
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
                <div
                  className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-[1000] transition-all duration-200 ease-in-out"
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
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
                </div>
              )}
            </div>
            {/* Logout Button */}
            <button
              onClick={this.handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Ticket Management */}
        <div className="bg-white p-6 rounded-lg shadow-md relative z-0">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Manage Tickets</h3>
          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              placeholder="Search tickets..."
              value={this.state.searchQuery}
              onChange={this.handleSearchChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
            <select
              value={this.state.statusFilter}
              onChange={this.handleStatusFilterChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <ul className="space-y-4">
            {filteredTickets.map((ticket) => (
              <li
                key={ticket._id}
                className="border p-4 rounded-md flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div>
                  <strong className="text-gray-800">{ticket.title}</strong> - {ticket.status} - Priority: {ticket.priority}
                  <br />
                  <span className="text-gray-600">{ticket.description}</span>
                </div>
                <select
                  value={ticket.status}
                  onChange={(e) => this.handleUpdateStatus(ticket._id, e.target.value)}
                  className="ml-4 border p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tickets: state.tickets,
  token: state.auth.token,
  userId: state.auth.userId,
});

const mapDispatchToProps = { setTickets, updateTicket, logout };

export default connect(mapStateToProps, mapDispatchToProps)(AgentDashboard);