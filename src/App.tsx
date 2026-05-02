import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Invoice from "./pages/Invoice";
import PublicApps from "./pages/PublicApps";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="projects" element={<Projects />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="booking" element={<Booking />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="apps" element={<PublicApps />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
