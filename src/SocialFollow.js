import React from "react";
import { FontAwesomeIcon } from "../node_modules/@fortawesome/react-fontawesome";
import { faTwitter } from "../node_modules/@fortawesome/free-brands-svg-icons";

export default function SocialFollow() {
  return (
    <div>
      <h3 className="heading">Follow On Twitter</h3>
      <a
        href="https://twitter.com/redcat641"
        className="twitter social"
        target="_Blank"
      >
        <FontAwesomeIcon icon={faTwitter} size="2x" />
      </a>
    </div>
  );
}
