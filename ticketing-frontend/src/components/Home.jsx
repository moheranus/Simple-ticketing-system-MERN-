/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { motion } from "framer-motion";

class Home extends Component {
  state = {
    formData: { name: "", email: "", message: "" },
    isMenuOpen: false,
  };

  handleChange = (e) => {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", this.state.formData);
    this.setState({ formData: { name: "", email: "", message: "" } });
  };

  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  render() {
    const { token } = this.props;
    const { formData, isMenuOpen } = this.state;

    const services = [
      { title: "Ticket Management", desc: "Efficiently track and resolve customer issues." },
      { title: "24/7 Support", desc: "Round-the-clock assistance for uninterrupted service." },
      { title: "Analytics Dashboard", desc: "Real-time insights to optimize your workflow." },
    ];

    const testimonials = [
      { quote: "SupportSync transformed our customer service experience!", author: "Nebyat Ahmed., Tech Lead" },
      { quote: "Fast, reliable, and futuristic – highly recommend!", author: "Daniel Shobe., Manager" },
    ];



    const smoothEasing = [0.6, 0.05, 0.1, 0.9];

    return (
      <div className="bg-white text-gray-800">
        {/* Header */}
        <motion.header
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.6, ease: smoothEasing }}
  className="bg-white text-gray-800 p-4 sticky top-0 z-50 shadow-md"
>
  <nav className="container mx-auto flex justify-between items-center">
    <h1 className="text-2xl font-bold">SupSync</h1>

    {/* Login / Signup */}
    <div>
      {!token ? (
        <>
        
<button className="cursor-pointer font-semibold overflow-hidden relative z-100 border border-blue-500 group px-8 py-2">
  <span className="relative z-10 text-blue-500 group-hover:text-white text-xl duration-500">
  <Link to="/login">Login</Link>
  </span>
  <span className="absolute w-full h-full bg-blue-500 -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500"></span>
  <span className="absolute w-full h-full bg-blue-500 -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500"></span>
</button>

<button className="ml-1 cursor-pointer font-semibold overflow-hidden relative z-100 border border-blue-500 group px-8 py-2">
  <span className="relative z-10 text-blue-500 group-hover:text-white text-xl duration-500">
  <Link to="/signup">Signup</Link>
  </span>
  <span className="absolute w-full h-full bg-blue-500 -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500"></span>
  <span className="absolute w-full h-full bg-blue-500 -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500"></span>
</button>
          {/* <Link to="/login" className="hover:text-gray-600 underline mr-4">Login</Link>
          <Link to="/signup" className="hover:text-gray-600 underline">Signup</Link> */}
        </>
      ) : (
        <Link to="/logout" className="hover:text-gray-600 underline">Logout</Link>
      )}
    </div>
  </nav>
</motion.header>



        {/* Hero */}
        <motion.section
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1, ease: smoothEasing }}
  className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-[50vh] lg:min-h-[60vh] flex items-center justify-center text-center px-6 py-12"
>
  <div className="container mx-auto">
    <motion.h1
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8, ease: smoothEasing }}
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 leading-tight mb-4"
    >
      Welcome to <span className="text-blue-600">SupportSync</span>
    </motion.h1>

    <motion.p
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: smoothEasing }}
      className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 max-w-3xl mx-auto mb-6"
    >
      Your streamlined <span className="font-semibold text-blue-500">ticketing system</span> for seamless support.
    </motion.p>

    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 120, damping: 10 }}
    >
      <Link
        to="/signup"
        className="bg-blue-600 text-white px-10 py-4  rounded-lg text-lg font-medium shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Get Started
      </Link>
    </motion.div>
  </div>
</motion.section>


        {/* Services */}
        <section id="services" className="py-12 lg:py-16 bg-gray-50">
  <div className="container mx-auto px-6 text-center">
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 text-gray-900"
    >
      Our <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">Services</span>
    </motion.h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <motion.div
          key={index}
          initial={{ y: 100, opacity: 0 }} // Start off-screen
          whileInView={{ y: 0, opacity: 1 }} // Slide in
          transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }} // Staggered effect
          viewport={{ once: true }} // Only animates once
          className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-200"
        >
          <div className="flex items-center justify-center mb-4">
            <span className="inline-block p-3 bg-blue-100 text-blue-600 rounded-full shadow-sm">
              {service.icon}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
          <p className="text-gray-700 text-base">{service.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>



        {/* Testimonials */}
        <section id="testimonials" className="py-12 lg:py-16 bg-gray-50">
  <div className="container mx-auto px-6 text-center">
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 text-gray-900"
    >
      What Our <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">Users Say</span>
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ x: index % 2 === 0 ? -80 : 80, opacity: 0 }} // Slide in from left/right
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }} // Ensures it only animates once per session
          className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 border border-gray-200"
        >
          <p className="italic text-gray-700 text-lg">"{testimonial.quote}"</p>
          <div className="mt-6 flex items-center justify-center space-x-3">
            {testimonial.avatar && (
              <img src={testimonial.avatar} alt={testimonial.author} className="w-10 h-10 rounded-full border border-gray-300" />
            )}
            <p className="font-semibold text-gray-900 text-lg">– {testimonial.author}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>


        {/* Contact Us */}
        <section id="contact" className="py-12 lg:py-16 bg-white">
  <div className="container mx-auto px-12 text-center">
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 text-gray-900"
    >
      Contact <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">Us</span>
    </motion.h2>

    <motion.form
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      onSubmit={this.handleSubmit}
      className="max-w-full sm:max-w-lg mx-auto space-y-5 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200"
    >
      {["name", "email", "message"].map((field, index) => (
        <motion.div
          key={field}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
        >
          {field !== "message" ? (
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={formData[field]}
              onChange={this.handleChange}
              placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              className="w-full p-3 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm"
            />
          ) : (
            <textarea
              name={field}
              value={formData[field]}
              onChange={this.handleChange}
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm"
            />
          )}
        </motion.div>
      ))}

      <motion.button
        type="submit"
        initial={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
      >
        Send Message
      </motion.button>
    </motion.form>
  </div>
</section>


        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: smoothEasing }}
          className="bg-gray-50 text-gray-800 p-4 sm:p-6 text-center"
        >
          <p className="text-sm sm:text-base">© 2025 SupportSync. All rights reserved.</p>
          <div className="mt-2 sm:mt-4 space-x-2 sm:space-x-4 text-sm sm:text-base">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
          </div>
        </motion.footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps)(Home);