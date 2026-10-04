import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <h2>
            Vandana<span>Travels</span>
          </h2>
          <p>
            Making your dream vacations come true with premium itineraries and
            top-tier support.
          </p>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li>
              <Link href="#">About Us</Link>
            </li>
            <li>
              <Link href="#">Contact</Link>
            </li>
            <li>
              <Link href="#">Careers</Link>
            </li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li>
              <Link href="#">FAQ</Link>
            </li>
            <li>
              <Link href="#">Terms of Service</Link>
            </li>
            <li>
              <Link href="#">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vandana Travels. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
