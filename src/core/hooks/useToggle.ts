import { useState } from "react";

export default function useToggle({onOpen,onClose}) {
    const [isOpen, setIsOpen] = useState(false);

    function toggler() {
        const nextIsOpen = !isOpen;
        setIsOpen(nextIsOpen);

        if (nextIsOpen) {
            onOpen();
        }
        else {
            onClose();
        }
    }
    return [isOpen, toggler];
}
