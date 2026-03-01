import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 px-6 py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-8 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4">
            <Link to="/" className="text-white text-xl font-bold tracking-tight">
              VeraLabel<span className="text-indigo-500">.</span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed max-w-xs font-light">
              Advancing AI global equity through high-fidelity data infrastructure for emerging markets.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-indigo-500 transition-colors cursor-pointer">
                <span className="sr-only">Twitter</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-indigo-500 transition-colors cursor-pointer">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/mission" className="hover:text-white transition-colors">Mission</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/signup?role=buyer" className="hover:text-white transition-colors">Explore</Link></li>
              <li><Link to="/signup?role=seller" className="hover:text-white transition-colors">Publish</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/data-policy" className="hover:text-white transition-colors">Data Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-medium tracking-wider uppercase text-gray-600">
            © {new Date().getFullYear()} VeraLabel Technology Group
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-medium tracking-wider uppercase text-gray-600">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;