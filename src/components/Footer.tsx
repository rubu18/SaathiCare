
import { Heart, Shield, Phone, Mail, MapPin, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#166488] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-xl">
                <Heart className="h-6 w-6 text-[#166488]" />
              </div>
              <div>
                <span className="text-xl font-bold">SaathiCare</span>
                <div className="text-sm text-blue-100">Professional Healthcare Companions</div>
              </div>
            </div>
            <p className="text-blue-100 mb-4 max-w-md">
              Providing compassionate, professional healthcare companions to support you through every medical journey.<br />
              Your comfort and care are our highest priorities.
            </p>
            <div className="flex items-center space-x-2 text-sm text-blue-100">
              <Shield className="h-4 w-4" />
              <span>Verified • Licensed • Insured</span>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/companions" className="hover:underline text-blue-100 hover:text-white transition-colors">
                  Find Companions
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:underline text-blue-100 hover:text-white transition-colors">
                  Hospital Search
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:underline text-blue-100 hover:text-white transition-colors">
                  Book Visit
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:underline text-blue-100 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-blue-100">
                <Phone className="h-4 w-4" />
                <span>+91 81359 43334</span>
              </li>
              <li className="flex items-center space-x-2 text-blue-100">
                <Mail className="h-4 w-4" />
                <span>contact@suzocoservices.in</span>
              </li>
              <li className="flex items-start space-x-2 text-blue-100">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Kokrajhar, Assam, India</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/suzocoservices?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-pink-300 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/suzoco-services/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-blue-300 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-blue-100">
              © 2024 SaathiCare. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-sm text-blue-100 hover:underline hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-blue-100 hover:underline hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-blue-100 hover:underline hover:text-white transition-colors">
                Healthcare Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

