import { useState } from 'react';

export const useAdminAction = (actionCallback) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [targetId, setTargetId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAction = (id) => {
    setTargetId(id);
    setIsOpen(true);
  };

  const closeAction = () => {
    setIsOpen(false);
    setReason("");
    setTargetId(null);
  };

  const handleExecute = async () => {
    if (!targetId || !reason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await actionCallback(targetId, reason);
      closeAction();
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isOpen, reason, setReason, isSubmitting, openAction, closeAction, handleExecute };
};
export default useAdminAction;