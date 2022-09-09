import { BrowserRouter as Router, Link } from "react-router-dom";
import "./style.css";

export default function button() {
  return (
    <Router>
      <div>
        <br />
        <br />

        {/* 👇️ Anchor link */}
        <a
          href="https://opensea.io/collection/gifrevlnfts"
          target="_blank"
          rel="noreferrer"
        >
          <button className="btn">OpenSea</button>
        </a>
      </div>
    </Router>
  );
}
