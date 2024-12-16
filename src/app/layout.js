'use client';

import Navbar from './components/Navbar';
import { AuthProvider } from '../context/AuthContext';
import './styles/layout.css';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="footer">
            <p>© 2024 EasyStay. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
