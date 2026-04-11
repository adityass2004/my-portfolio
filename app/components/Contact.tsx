import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
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
import { getPersonalInfo, getContactInfo, PersonalInfo, ContactInfo } from '../data/portfolioService';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactDetail {
  icon: React.ComponentType<any>;
  title: string;
  value: string;
  link: string;
}

interface SocialLink {
  icon: React.ComponentType<any>;
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
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "gmail" | null>(null);

  useEffect(() => {
    Promise.all([getPersonalInfo(), getContactInfo()])
      .then(([personal, contact]) => {
        setPersonalInfo(personal);
        setContactInfo(contact);
      })
      .catch(console.error);
  }, []);

  if (!personalInfo || !contactInfo) {
    return <div>Loading...</div>;
  }

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
    { 
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ), 
      href: contactInfo.social.github, 
      label: "GitHub" 
    },
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
    <section id="contact" className="p-[100px_4rem] border-b border-border-new bg-paper">
      <div className="section-header fade-in visible">
        <span className="section-num">08</span>
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] line-height-[1.1] text-ink">Get in touch</h2>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-24 items-start fade-in visible">
        <div className="contact-info">
          <p className="text-[1.05rem] text-muted leading-relaxed mb-12 max-w-[480px]">
            I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions. 
            Feel free to reach out through any of the channels below or use the form.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {contactDetails.map((info) => (
              <div key={info.title} className="bg-white/5 backdrop-blur-sm border border-border-new/40 p-6 rounded-2xl hover:border-accent-new/30 transition-all duration-300 group">
                <div className="w-10 h-10 bg-accent-new/10 text-accent-new rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-new group-hover:text-white transition-all">
                  <info.icon size={18} />
                </div>
                <div className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-muted mb-1">{info.title}</div>
                <a href={info.link} className="text-[0.95rem] text-ink font-medium no-underline hover:text-accent-new transition-colors break-words">{info.value}</a>
              </div>
            ))}
          </div>

          <div className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-muted mb-6 flex items-center gap-4">
            <span className="h-[1px] w-8 bg-border-new"></span>
            Social Ecosystem
          </div>
          <div className="flex flex-wrap gap-3 mb-12">
            {socialLinks.map((social) => (
              <a 
                key={social.label} 
                href={social.href} 
                target="_blank" 
                rel="noopener" 
                className="w-12 h-12 flex items-center justify-center bg-white/5 border border-border-new/40 rounded-full text-muted hover:text-accent-new hover:border-accent-new hover:bg-accent-new/5 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <div className="avail-row flex items-center gap-3 font-mono text-[0.75rem] text-muted bg-accent-new/5 w-fit px-5 py-2.5 rounded-full border border-accent-new/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent-new animate-pulse"></span>
            {contactInfo.availability}
          </div>
        </div>

        <div className="contact-form bg-white/5 backdrop-blur-md border border-border-new/40 p-12 rounded-[40px] shadow-sm flex flex-col gap-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-new/5 blur-3xl -z-10 group-hover:bg-accent-new/10 transition-colors"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-3">
              <label className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-muted ml-1">Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="bg-transparent border-b border-border-new/60 py-3 px-1 focus:outline-none focus:border-accent-new transition-colors text-ink placeholder:text-muted/30 text-[0.95rem]" 
                placeholder="Aditya Sagar" 
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-muted ml-1">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="bg-transparent border-b border-border-new/60 py-3 px-1 focus:outline-none focus:border-accent-new transition-colors text-ink placeholder:text-muted/30 text-[0.95rem]" 
                placeholder="hello@example.com" 
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <label className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-muted ml-1">Subject</label>
            <input 
              type="text" 
              name="subject" 
              value={formData.subject} 
              onChange={handleInputChange} 
              className="bg-transparent border-b border-border-new/60 py-3 px-1 focus:outline-none focus:border-accent-new transition-colors text-ink placeholder:text-muted/30 text-[0.95rem]" 
              placeholder="Project Collaboration" 
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-muted ml-1">Message</label>
            <textarea 
              name="message" 
              rows={4} 
              value={formData.message} 
              onChange={handleInputChange} 
              className="bg-transparent border-b border-border-new/60 py-3 px-1 focus:outline-none focus:border-accent-new transition-colors text-ink placeholder:text-muted/30 resize-none text-[0.95rem] leading-relaxed" 
              placeholder="Tell me about your project..." 
            />
          </div>

          <div className="flex flex-col gap-5 mt-4">
            <button 
              onClick={handleFormspreeSubmit}
              disabled={isSubmitting}
              className="btn-primary w-full py-5 flex items-center justify-center gap-3 group/btn"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-border-new/30"></div>
              <span className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">or</span>
              <div className="h-[1px] flex-1 bg-border-new/30"></div>
            </div>

            <button 
              onClick={handleGmailOption}
              className="btn-ghost w-full py-4 flex items-center justify-center gap-3 text-[0.75rem]"
            >
              Quick Mail via Gmail <MailOpen size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {submitStatus && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-paper border border-border-new p-10 max-w-md w-full shadow-2xl rounded-[32px]"
          >
            <button 
              onClick={() => setSubmitStatus(null)} 
              className="absolute top-6 right-6 font-mono text-sm hover:text-accent-new transition-colors"
            >
              ✕
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-new/10 text-accent-new rounded-2xl flex items-center justify-center mx-auto mb-6">
                {submitStatus === "success" ? <CheckCircle size={32} /> : submitStatus === "gmail" ? <MailOpen size={32} /> : <AlertCircle size={32} />}
              </div>
              <div className="font-serif text-2xl text-ink mb-3">
                {submitStatus === "success" ? "Message Sent!" : submitStatus === "gmail" ? "Gmail Opened!" : "Oops!"}
              </div>
              <p className="font-mono text-[0.85rem] text-muted mb-8 leading-relaxed">
                {submitStatus === "success" ? "Your message has been sent successfully. I'll get back to you soon!" : 
                 submitStatus === "gmail" ? "Please complete and send the email in your Gmail tab." : 
                 "There was an error sending your message. Please try again or use the Gmail option."}
              </p>
              <button 
                onClick={() => setSubmitStatus(null)} 
                className="w-full py-4 rounded-xl bg-ink text-white font-mono text-[0.75rem] tracking-[0.1em] uppercase hover:bg-accent-new transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Contact;
