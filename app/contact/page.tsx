"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  Star,
} from "lucide-react";
import { PointerHighlight } from "../../components/ui/pointer-highlight";
import H1Reveal from "../../components/H1Reveal";
import RatingForm from "../../components/RatingForm";

// Lazy load Spline with proper Next.js import
const Spline = dynamic(
  () =>
    import("@splinetool/react-spline").then((mod) => ({
      default: mod.default,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-gray-500/10 via-slate-900/80 to-gray-500/10" />
    ),
  }
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    occupation: "",
    reason: "",
    howDidYouHear: "",
    messageTitle: "",
    message: "",
    consent: false,
    // recaptchaToken: "", // set when you wire reCAPTCHA
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [mounted, setMounted] = useState(false);
  const [splineError, setSplineError] = useState(false);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  useEffect(() => setMounted(true), []);

  const handleSplineError = (error: any) => {
    console.warn("Contact Spline loading error:", error);
    setSplineError(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic front-end guards (we’ll replace with Zod + API later)
    if (!formData.consent) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    try {
      // Build payload that matches createInquirySchema
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || undefined,
        country: formData.country,
        occupation: formData.occupation,
        reason: formData.reason,
        howDidYouHear: formData.howDidYouHear || undefined,
        messageTitle: formData.messageTitle,
        message: formData.message,
        consent: formData.consent,
      };

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Submission failed:", errorText);
        throw new Error(errorText);
      }

      const result = await res.json();
      console.log("Inquiry created:", result);

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        country: "",
        occupation: "",
        reason: "",
        howDidYouHear: "",
        messageTitle: "",
        message: "",
        consent: false,
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      info: "hello@aisolutions.com",
      description: "Send us an email anytime",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 6pm",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Response Time",
      info: "Within 24 hours",
      description: "We respond quickly",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Office Hours",
      info: "Monday - Friday",
      description: "8:00 AM to 6:00 PM EST",
    },
  ];

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const occupations = [
    "Student",
    "Software Developer",
    "Data Scientist",
    "AI/ML Engineer",
    "Business Analyst",
    "Product Manager",
    "Consultant",
    "CEO/Founder",
    "CTO",
    "Engineering Manager",
    "Marketing Manager",
    "Sales Manager",
    "HR Manager",
    "Operations Manager",
    "Healthcare Professional",
    "Finance Professional",
    "Legal Professional",
    "Education Professional",
    "Research Scientist",
    "Designer",
    "Entrepreneur",
    "Project Manager",
    "Quality Assurance",
    "DevOps Engineer",
    "System Administrator",
    "Database Administrator",
    "UI/UX Designer",
    "Digital Marketing Specialist",
    "Content Creator",
    "Journalist",
    "Architect",
    "Civil Engineer",
    "Mechanical Engineer",
    "Electrical Engineer",
    "Chemical Engineer",
    "Biomedical Engineer",
    "Pharmacist",
    "Nurse",
    "Doctor",
    "Dentist",
    "Therapist",
    "Psychologist",
    "Social Worker",
    "Teacher",
    "Professor",
    "Librarian",
    "Accountant",
    "Financial Advisor",
    "Banker",
    "Insurance Agent",
    "Real Estate Agent",
    "Chef",
    "Artist",
    "Musician",
    "Writer",
    "Photographer",
    "Filmmaker",
    "Retail Manager",
    "Customer Service",
    "Administrative Assistant",
    "Executive Assistant",
    "Other",
  ];

  const reasonOptions = [
    "General Inquiry",
    "Technical Support",
    "Book a Demo",
    "Careers",
    "Partnerships",
    "Events Inquiry",
  ];

  const hearOptions = [
    "Google",
    "LinkedIn",
    "Social Media",
    "Email Marketing",
    "Referral",
    "Event",
    "Other",
  ];

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#05010D] text-white">
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="w-48 h-8 bg-white/5 rounded-full mx-auto" />
              <div className="w-96 h-16 bg-white/5 rounded mx-auto" />
              <div className="w-full max-w-4xl h-96 bg-white/5 rounded-2xl mx-auto" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#05010D] text-white overflow-hidden">
      {/* Hide Spline watermarks */}
      <style jsx global>{`
        #spline-watermark,
        .spline-watermark,
        [class*="watermark"],
        .spline-logo,
        [data-spline*="logo"],
        [class*="spline-logo"],
        canvas + div,
        canvas ~ div,
        div[style*="position: absolute"][style*="bottom"],
        div[style*="position: absolute"][style*="right"],
        div[style*="position: fixed"][style*="bottom"],
        div[style*="position: fixed"][style*="right"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -9999 !important;
        }
      `}</style>

      {/* Hero Section with Spline Background */}
      <section className="relative min-h-screen flex items-center justify-center mt-12 overflow-hidden">
        {/* Spline 3D Background with Parallax */}
        <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
          {!splineError ? (
            <Spline
              scene="https://prod.spline.design/jZFPkgYROzjGBSuV/scene.splinecode"
              onError={handleSplineError}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-500/10 via-slate-900/80 to-gray-500/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#05010D]/80 via-[#05010D]/60 to-[#05010D]/95" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center min-h-screen py-24">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <MessageCircle className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-gray-300">
                  Ready to Help You Succeed
                </span>
              </motion.div>

              <H1Reveal>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              >
                <span className="text-white">Get in Touch</span>
                <br />
                <PointerHighlight>
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    With Our Team
                  </span>
                </PointerHighlight>
              </motion.h1>
              </H1Reveal>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl text-gray-300 leading-relaxed max-w-2xl"
              >
                Our experienced team is ready to discuss your project
                requirements and provide tailored AI solutions that drive real
                business results.
              </motion.p>

              {/* Contact Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.5, duration: 0.8, staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12"
              >
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                    className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm cursor-default"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-slate-400">{item.icon}</div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-gray-300 font-medium mb-1">
                      {item.info}
                    </p>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute -inset-1" />
                <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                  <motion.div
                    className="flex items-center gap-3 mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div className="p-2 rounded-lg bg-slate-500/20">
                      <Users className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Send Us a Message
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Fill out the form below and we'll get back to you
                      </p>
                    </div>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    <motion.form
                      key="contact-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="space-y-6 flex-1"
                    >
                      {/* Name & Email */}
                      <motion.div
                        className="grid md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                      >
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-300 mb-3"
                          >
                            Full Name *
                          </label>
                          <motion.input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-slate-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300 mb-3"
                          >
                            Email Address *
                          </label>
                          <motion.input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-slate-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200"
                            placeholder="john@company.com"
                            autoComplete="email"
                          />
                        </div>
                      </motion.div>

                      {/* Phone & Company */}
                      <motion.div
                        className="grid md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.18, duration: 0.6 }}
                      >
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-300 mb-3"
                          >
                            Phone Number *
                          </label>
                          <motion.input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            pattern="^[+]?[\d\s()-]{7,20}$"
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-slate-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200"
                            placeholder="+1 555 123 4567"
                            autoComplete="tel"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="company"
                            className="block text-sm font-medium text-gray-300 mb-3"
                          >
                            Company
                          </label>
                          <motion.input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-slate-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200"
                            placeholder="Your Company"
                          />
                        </div>
                      </motion.div>

                      {/* Country & Occupation */}
                      <motion.div
                        className="grid md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.22, duration: 0.6 }}
                      >
                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-300 mb-3"
                          >
                            Country *
                          </label>
                          <div className="relative">
                            <motion.select
                              id="country"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              required
                              whileFocus={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="w-full px-4 py-3 pr-10 rounded-lg bg-white/5 border border-white/10 text-white focus:border-slate-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-slate-900">
                                Select your country
                              </option>
                              {countries.map((country, index) => (
                                <option
                                  key={index}
                                  value={country}
                                  className="bg-slate-900"
                                >
                                  {country}
                                </option>
                              ))}
                            </motion.select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="occupation"
                            className="block text-sm font-medium text-gray-300 mb-3"
                          >
                            Occupation *
                          </label>
                          <div className="relative">
                            <motion.select
                              id="occupation"
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleInputChange}
                              required
                              whileFocus={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="w-full px-4 py-3 pr-10 rounded-lg bg-white/5 border border-white/10 text-white focus:border-slate-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-slate-900">
                                Select your occupation
                              </option>
                              {occupations.map((occupation, index) => (
                                <option
                                  key={index}
                                  value={occupation}
                                  className="bg-slate-900"
                                >
                                  {occupation}
                                </option>
                              ))}
                            </motion.select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Reason & How did you hear */}
                      <motion.div
                        className="grid md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.26, duration: 0.6 }}
                      >
                        <div>
                          <label
                            htmlFor="reason"
                            className="block text-sm font-medium text-gray-300 mb-3"
                          >
                            Reason for Inquiry *
                          </label>
                          <div className="relative">
                            <motion.select
                              id="reason"
                              name="reason"
                              value={formData.reason}
                              onChange={handleInputChange}
                              required
                              whileFocus={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="w-full px-4 py-3 pr-10 rounded-lg bg-white/5 border border-white/10 text-white focus:border-slate-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-slate-900">
                                Select a reason
                              </option>
                              {reasonOptions.map((r, i) => (
                                <option
                                  key={i}
                                  value={r}
                                  className="bg-slate-900"
                                >
                                  {r}
                                </option>
                              ))}
                            </motion.select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="howDidYouHear"
                            className="block text-sm font-medium text-gray-300 mb-3"
                          >
                            How did you hear about us?
                          </label>
                          <div className="relative">
                            <motion.select
                              id="howDidYouHear"
                              name="howDidYouHear"
                              value={formData.howDidYouHear}
                              onChange={handleInputChange}
                              whileFocus={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="w-full px-4 py-3 pr-10 rounded-lg bg-white/5 border border-white/10 text-white focus:border-slate-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                            >
                              <option value="" className="bg-slate-900">
                                Select an option (optional)
                              </option>
                              {hearOptions.map((h, i) => (
                                <option
                                  key={i}
                                  value={h}
                                  className="bg-slate-900"
                                >
                                  {h}
                                </option>
                              ))}
                            </motion.select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Message Title */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      >
                        <label
                          htmlFor="messageTitle"
                          className="block text-sm font-medium text-gray-300 mb-3"
                        >
                          Message Title *
                        </label>
                        <motion.input
                          type="text"
                          id="messageTitle"
                          name="messageTitle"
                          value={formData.messageTitle}
                          onChange={handleInputChange}
                          required
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-slate-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200"
                          placeholder="Brief title for your message"
                        />
                      </motion.div>

                      {/* Message */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.34, duration: 0.6 }}
                      >
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-300 mb-3"
                        >
                          Message Description *
                        </label>
                        <motion.textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-slate-400/50 focus:bg-white/10 focus:outline-none transition-all duration-200 resize-none"
                          placeholder="Provide detailed information about your requirements..."
                        />
                      </motion.div>

                      {/* Consent + (Placeholder) reCAPTCHA */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.38, duration: 0.6 }}
                        className="flex items-start gap-3"
                      >
                        <input
                          id="consent"
                          name="consent"
                          type="checkbox"
                          checked={formData.consent}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-slate-400 focus:ring-0"
                          required
                        />
                        <label
                          htmlFor="consent"
                          className="text-sm text-gray-300"
                        >
                          I agree to be contacted about my inquiry and
                          understand my data will be handled according to the
                          Privacy Policy.
                        </label>
                      </motion.div>

                      {/* TODO: Insert reCAPTCHA widget here and set formData.recaptchaToken */}

                      {/* Submit Status */}
                      <AnimatePresence>
                        {submitStatus === "success" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4"
                          >
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">
                              Message sent successfully! We'll get back to you
                              soon.
                            </span>
                          </motion.div>
                        )}

                        {submitStatus === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-4"
                          >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">
                              Something went wrong. Please check the form and
                              try again.
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Button */}
                      <motion.div
                        className="pt-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.42, duration: 0.6 }}
                      >
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                          className="w-full group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-slate-700 to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative flex items-center justify-center gap-2">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending Message...
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                Send Message
                              </>
                            )}
                          </div>
                        </motion.button>
                      </motion.div>
                    </motion.form>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rating and Feedback Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
            >
              <Star className="w-4 h-4 text-[#00FFB7]" />
              <span className="text-sm font-medium text-gray-300">
                Share Your Experience
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
            >
              Rate Your Experience
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Help us improve by sharing your feedback. Your rating and comments help us serve you better.
            </motion.p>
          </motion.div>

          <RatingForm />
        </div>
      </section>
    </main>
  );
}
