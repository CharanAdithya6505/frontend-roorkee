import React from "react";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton, EmailShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon, EmailIcon } from "react-share";
import { X } from "lucide-react";
import Image from "next/image";
import xLogo from "@/assets/Xlogo.png";

const ShareModal = ({ url, title, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Share This Scheme</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>

        <div className="flex justify-around mt-4">
          <FacebookShareButton url={url} quote={title}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>

          <TwitterShareButton url={url} title={title}>
            <div className=" w-16 flex items-center justify-center rounded-full overflow-hidden">
                <Image src={xLogo} alt="X" />
            </div>
            </TwitterShareButton>

          <WhatsappShareButton url={url} title={title}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>

          <LinkedinShareButton url={url}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>

          <EmailShareButton url={url} subject={title} body="Check out this scheme:">
            <EmailIcon size={40} round />
          </EmailShareButton>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
