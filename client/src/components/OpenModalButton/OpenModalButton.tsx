import { ReactElement } from "react";
import { useModal } from "../../context/Modal/Modal";

interface OpenModalButtonProps {
  modalComponent: ReactElement;
  buttonText: string;
  onButtonClick?: () => void; // Callback function, no return value expected
  onModalClose?: () => void;
  onItemClick?: () => void;
  className?: string;
}

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
  onItemClick,
  className,
}: OpenModalButtonProps) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onItemClick) {
      onItemClick(); // Call onItemClick if it's provided
    }
    if (onButtonClick) {
      onButtonClick(); // Call the callback function
    }

    setModalContent(modalComponent);
    if (onModalClose) {
      setOnModalClose(onModalClose);
    }
  };

  return (
    <button className={className} onClick={onClick}>
      {buttonText}
    </button>
  );
}

export default OpenModalButton;
