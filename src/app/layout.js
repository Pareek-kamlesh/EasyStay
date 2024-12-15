'use client';

import Navbar from './components/Navbar'; // Adjust the path based on your project structure
import './styles/layout.css';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Include Navbar */}
        <Navbar />

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="footer">
          <p>© 2024 EasyStay. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
