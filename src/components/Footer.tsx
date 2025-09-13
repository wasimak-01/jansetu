import React from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CivicReport</h3>
                <p className="text-sm text-gray-400">Making communities better</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering citizens and municipal governments to work together for stronger, 
              safer communities through transparent issue reporting and resolution.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">(555) CIVIC-01</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">support@civicreport.gov</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-300">
                  123 Municipal Drive<br />
                  City Hall, Suite 200<br />
                  Your City, State 12345
                </span>
              </div>
            </div>
          </div>

          {/* Service Hours & Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Service Information</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <div className="font-medium">Report Processing Hours:</div>
                  <div>Monday - Friday: 8:00 AM - 6:00 PM</div>
                  <div>Emergency issues: 24/7</div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Accessibility</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 CivicReport. All rights reserved. Built for transparent governance.
            </p>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <span className="text-sm text-gray-400">
                Powered by community engagement
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;