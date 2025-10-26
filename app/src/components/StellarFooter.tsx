export default function StellarFooter() {
  return (
    <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              Transparent infrastructure funding for the future
            </p>
            <p className="text-gray-500 text-xs mt-1">
              © 2024 Provynce. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Powered by Stellar */}
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all group"
            >
              <svg className="w-6 h-6 text-stellar-blue" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.283 1.851L6 5.116v13.768l6.283-3.265 6.283 3.265V5.116L12.283 1.851zm4.85 15.518l-4.85-2.52-4.85 2.52V6.548l4.85-2.52 4.85 2.52v10.821z"/>
                <circle cx="12.283" cy="12" r="2.5"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 leading-none">Powered by</span>
                <span className="text-white font-bold leading-none mt-0.5">Stellar</span>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-stellar-blue transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>

            {/* Soroban Smart Contracts */}
            <a
              href="https://soroban.stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-stellar-blue transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Soroban Smart Contracts
            </a>

            {/* Testnet indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
              <span className="text-yellow-400 text-xs font-semibold">Testnet</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap justify-center gap-6 text-sm">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            About
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Documentation
          </a>
          <a
            href="https://testnet.stellarchain.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-stellar-blue transition-colors flex items-center gap-1"
          >
            Block Explorer
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
