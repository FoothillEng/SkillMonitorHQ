import { FaCheck, FaTimes } from 'react-icons/fa';

interface FaOptionsProps {
    handleConfirm: (boolean) => void;
}

const FaOptions = ({ handleConfirm }: FaOptionsProps) => {
    return (
        <div className="flex flex-row justify-around">
            <div className="border-[1rem] border-green p-[3rem] ">
                <FaCheck
                    size={'7rem'}
                    className="modal-block text-center text-green"
                    onClick={() => handleConfirm(true)}
                />
            </div>
            <div className="modal-block border-[1rem] border-red p-[3rem]">
                <FaTimes
                    size={'7rem'}
                    className="text-red"
                    onClick={() => handleConfirm(false)}
                />
            </div>
        </div>
    );
};

export default FaOptions;
