import Modal from 'react-modal';
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';


const ShareModal = ({ isOpen, onRequestClose, shareUrl }) => {
    const [copied, setCopied] = useState(false);
  
    const handleCopy = () => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000); // I am giving time of 3 sec. to show copied
    };
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Share Modal"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 z-80 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Share this scheme</h2>


        <div className="flex justify-around">
            
            {/* adding copy functionality */}
        <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
            <span className="cursor-pointer mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-copy hover:scale-110"
                width="32"
                height="32"
              >
                <rect x="9" y="10" width="13" height="13" rx="2" ry="2" ></rect>
                <path d="M5 15h2a2 2 0 0 0 2-2V5h8a2 2 0 0 0 2 2v2"></path>
              </svg>
            </span>
          </CopyToClipboard>
          {copied ? <span className="text-green-500 mr-2 mt-2">Copied!</span> : null}


          <FacebookShareButton url={shareUrl} className='mr-2'>
            <FacebookIcon size={32} round className='hover:scale-110'/>
          </FacebookShareButton>
          <WhatsappShareButton url={shareUrl} className='mr-2'>
            <WhatsappIcon size={32} round className='hover:scale-110'/>
          </WhatsappShareButton>
          <TelegramShareButton url={shareUrl} className='mr-2'>
            <TelegramIcon size={32} round className='hover:scale-110'/>
          </TelegramShareButton>
          <LinkedinShareButton url={shareUrl} className='mr-2'>
            <LinkedinIcon size={32} round className='hover:scale-110'/>
          </LinkedinShareButton>
          <TwitterShareButton url={shareUrl} className='mr-2'>
            <TwitterIcon size={32} round className='hover:scale-110'/>
          </TwitterShareButton>
          <EmailShareButton url={shareUrl} className='mr-2'>
            <EmailIcon size={32} round className='hover:scale-110'/>
          </EmailShareButton>
          
        </div>


        <button
          onClick={onRequestClose}
          className="mt-6 bg-red-500 hover:bg-red-800 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Close
        </button>
      </Modal>
    );
  };
  
  export default ShareModal;
  