"use client";
import { CloudArrowUp } from "phosphor-react";
import {
  Button,
  Modal,
  ModalAction,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "keep-react";

export const KeepModalComponent = ({
  isOpen,
  setIsOpen,
  children,
  className,
}) => {
  return (
    <Modal
      open={isOpen}
      showCloseIcon={true}
      onOpenChange={() => setIsOpen(!isOpen)}
    >
      <ModalContent className={`  ${className}`}>{children}</ModalContent>
    </Modal>
  );
};
