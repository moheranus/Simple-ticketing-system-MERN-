/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
class Signup extends Component {
  state = { name: "", email: "", password: "" };

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = this.state;

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        role: "user", // Default role is 'user'
      });

      alert("Signup successful! Please login.");
      this.props.navigate("/login");
    } catch (error) {
      alert("Signup failed! Try again.");
    }
  };

  render() {
    return (
      <div className="max-w-sm mx-auto mt-10 p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 border rounded mb-2"
            onChange={this.handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
            onChange={this.handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-2"
            onChange={this.handleChange}
            required
          />
          <button type="submit" className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 cursor-pointer">
            Signup
          </button>
        </form>
        <div class="text-sm text-center mt-[1.6rem]">Already have an account? <Link to="/login" className="hover:text-gray-600 underline">Login</Link></div>
      </div>
    );
  }
}

// Wrapping with `useNavigate`
export default (props) => <Signup {...props} navigate={useNavigate()} />;
