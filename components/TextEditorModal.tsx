import React, { useEffect, useState, useRef } from 'react';
import TextEditor from './TextEditor';
import { X } from './icons';

interface TextEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TextEditorModal: React.FC<TextEditorModalProps> = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    document.body.style.overflow = 'unset';
    modalRef.current?.classList.add('opacity-0');
    modalContentRef.current?.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      setShow(false);
      onClose();
    }, 300); // Duration of animation
  };

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleClose]);

  useEffect(() => {
      if (show) {
        setTimeout(() => {
            modalRef.current?.classList.remove('opacity-0');
            modalContentRef.current?.classList.remove('opacity-0', 'scale-95');
        }, 10);
      }
  }, [show]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === event.target) {
      handleClose();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 opacity-0 transition-opacity duration-300 ease-in-out"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-7xl h-[90vh] flex flex-col transform opacity-0 scale-95 transition-all duration-300 ease-in-out"
      >
        <button
            onClick={handleClose}
            className="absolute -top-3 -right-3 z-20 p-2 rounded-full text-white bg-slate-900/90 hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close editor"
        >
            <X className="w-5 h-5" />
        </button>
        <div className="w-full h-full overflow-hidden rounded-xl shadow-2xl flex-grow">
            <TextEditor />
        </div>
      </div>
    </div>
  );
};

export default TextEditorModal;