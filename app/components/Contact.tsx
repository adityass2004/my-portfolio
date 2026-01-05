import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  CheckCircle,
  MailOpen,
  X,
  AlertCircle,
  LucideIcon
} from "lucide-react";
import { getPersonalInfo, PersonalInfo } from '../data/portfolioService';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactDetail {
  icon: LucideIcon;
  title: string;
  value: string;
  link: string;
}

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

// Mock data - replace with your actual data

const personalInfoBio = {
  bio: "I'm passionate about creating innovative solutions and bringing ideas to life through code. Let's collaborate on your next project!"
};

const FORMSPREE_FORM_ID = "mzznaryk";

const Contact: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "gmail" | null>(null);

  useEffect(() => {
    getPersonalInfo().then(setPersonalInfo).catch(console.error);
  }, []);

  if (!personalInfo) {
    return <div>Loading...</div>;
  }

  const contactInfo = {
    email: personalInfo.email,
    phone: personalInfo.phone,
    location: personalInfo.location,
    availability: "Available for new projects",
    responseTime: "Usually responds within 24 hours",
    social: {
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      twitter: "https://twitter.com/yourusername",
      instagram: "https://instagram.com/yourusername",
      youtube: "https://youtube.com/@yourusername"
    }
  };

  const contactDetails: ContactDetail[] = [
    {
      icon: Mail,
      title: "Email",
      value: contactInfo.email,
      link: `mailto:${contactInfo.email}`,
    },
    {
      icon: Phone,
      title: "Phone",
      value: contactInfo.phone,
      link: `tel:${contactInfo.phone}`,
    },
    {
      icon: MapPin,
      title: "Location",
      value: contactInfo.location,
      link: "#",
    },
  ];

  const socialLinks: SocialLink[] = [
    { icon: Github, href: contactInfo.social.github, label: "GitHub" },
    { icon: Linkedin, href: contactInfo.social.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: contactInfo.social.twitter, label: "Twitter" },
    { icon: Instagram, href: contactInfo.social.instagram, label: "Instagram" },
    { icon: Youtube, href: contactInfo.social.youtube, label: "YouTube" },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormspreeSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGmailOption = () => {
    setIsSubmitting(true);

    try {
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}&su=${subject}&body=${body}`;
      window.open(gmailUrl, "_blank");

      setSubmitStatus("gmail");
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error("Error opening Gmail link:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-gradient-to-tl from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center justify-center flex-wrap gap-2">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>Get In</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Let's discuss your next project and bring your ideas to life
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Contact Information - Left Side */}
          <div className="space-y-6 sm:space-y-8">
            {/* Introduction */}
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6 flex items-center flex-wrap gap-2">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>Let's Start a</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Conversation</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {personalInfoBio.bio}
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {contactDetails.map((info) => (
                <a
                  key={info.title}
                  href={info.link}
                  className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{info.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                Follow Me
              </h4>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                <span className="text-green-600 dark:text-green-400 font-medium text-xs sm:text-sm md:text-base flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {contactInfo.availability}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm flex items-center">
                <MessageCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                {contactInfo.responseTime}
              </p>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              <Send className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              Send Message
            </h3>

            <div className="space-y-4 sm:space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  placeholder="What's this about?"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Buttons */}
              <div className="space-y-3 sm:space-y-4">
                {/* Primary: Formspree Button */}
                <button
                  onClick={handleFormspreeSubmit}
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 text-sm sm:text-base ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Send Message via Form</span>
                      <span className="sm:hidden">Send via Form</span>
                    </>
                  )}
                </button>

                {/* Secondary: Gmail Button */}
                <button
                  onClick={handleGmailOption}
                  disabled={isSubmitting}
                  className={`w-full bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 text-sm sm:text-base ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  <MailOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Open in Gmail (Alternative)</span>
                  <span className="sm:hidden">Open in Gmail</span>
                </button>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {submitStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setSubmitStatus(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200 hover:rotate-90 transform"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Success Message */}
            {submitStatus === "success" && (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                  Your message has been sent successfully via Formspree. I'll get back to you soon!
                </p>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            )}

            {/* Gmail Message */}
            {submitStatus === "gmail" && (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <MailOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Gmail Opened!
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                  Please send the email in Gmail to complete your message. Make sure to check your drafts if needed.
                </p>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === "error" && (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Oops! Something Went Wrong
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                  There was an error sending your message. Please try again or use the Gmail option as an alternative.
                </p>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
