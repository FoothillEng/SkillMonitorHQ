import { use, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { FaTimes } from 'react-icons/fa';

const ModalContent = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
            <div className="fixed inset-y-[80rem]">
                <div className="flex flex-col items-center bg-primary-900 p-[5rem]">
                    <FaTimes
                        size={'10rem'}
                        className=" mb-[2rem] flex self-end text-secondary"
                        onClick={onClose}
                    />
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
};

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
    useEffect(() => {
        const handleCloseOutsideModal = (e) => {
            if (!e.target.classList.contains('modal-block')) {
                onClose();
            }
        };
        document.addEventListener('touchstart', handleCloseOutsideModal);

        return () => {
            document.removeEventListener('touchstart', handleCloseOutsideModal);
        };
    }, [onClose]);

    return createPortal(
        <div>
            {isOpen && (
                <ModalContent onClose={onClose}>{children}</ModalContent>
            )}
        </div>,
        document.getElementById('modal') ?? document.body
    );
};

export default Modal;
