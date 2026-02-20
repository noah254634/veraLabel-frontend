import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white text-center text-gray-400 px-6 py-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/mission" className="hover:text-white">Mission</Link></li>
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
          </ul>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-white font-semibold mb-4">Platform</h4>
          <ul className="space-y-2">
            <li><Link to="/signup?role=buyer" className="hover:text-white">Explore Datasets</Link></li>
            <li><Link to="/signup?role=seller" className="hover:text-white">Publish Dataset</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/data-policy" className="hover:text-white">Data Usage Policy</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom Strip */}
      <div className="mt-16 border-t border-gray-800 pt-6 text-center text-sm">
        © {new Date().getFullYear()} VeraLabel. All rights reserved.
        <p className="mt-2 text-gray-500">
          Building AI data infrastructure for emerging markets.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
