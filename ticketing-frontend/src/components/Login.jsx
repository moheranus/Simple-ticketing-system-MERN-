/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { connect } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

class Login extends Component {
  state = { email: "", password: "" };

  componentDidMount() {
    // If the user is already logged in, redirect to the dashboard/admin/agent
    if (localStorage.getItem("token")) {
      const role = localStorage.getItem("role");
      if (role === "admin") {
        this.props.navigate("/admin");
      } else if (role === "agent") {
        this.props.navigate("/agent");
      } else {
        this.props.navigate("/dashboard");
      }
    }
  }

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      this.props.loginSuccess(res.data); // Store user data in redux

      // Redirect based on role
      if (res.data.role === "admin") {
        this.props.navigate("/admin");
      } else if (res.data.role === "agent") {
        this.props.navigate("/agent");
      } else {
        this.props.navigate("/dashboard");
      }

      // Save role and token in localStorage for future persistence
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  render() {
    return (
      <div className="max-w-sm mx-auto mt-12 p-12 bg-white rounded-lg shadow-lg">
        <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">Welcome back to <span className="text-[#7747ff]"> SupSync</span></div>
        {/* <h2 className="text-2xl font-bold mb-4">Login</h2> */}
        <form onSubmit={this.handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={this.handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded mt-2"
            onChange={this.handleChange}
          />
          <button type="submit" className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 cursor-pointer">
            Login
          </button>

        </form>
        <div class="text-sm text-center mt-[1.6rem]">Don’t have an account yet? <Link to="/signup" className="hover:text-gray-600 underline">Signup</Link></div>
      </div>
    );
  }
}

const mapDispatchToProps = { loginSuccess };

export default connect(null, mapDispatchToProps)(props => <Login {...props} navigate={useNavigate()} />);
