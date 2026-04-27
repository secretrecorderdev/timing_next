"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { Button } from "@/shared/ui/primitives/button/Button";
import { Text } from "@/shared/ui/primitives/text/Text";

interface CommonModalProps {
  open: boolean;
  title?: ReactNode;
  children: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  hideConfirmButton?: boolean;
  hideCancelButton?: boolean;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  closeOnBackdropClick?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
  panelClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

export default function CommonModal({
  open,
  title,
  children,
  confirmText = "확인",
  cancelText = "취소",
  hideConfirmButton = false,
  hideCancelButton = false,
  confirmDisabled = false,
  cancelDisabled = false,
  closeOnBackdropClick = true,
  onConfirm,
  onCancel,
  className,
  panelClassName,
  contentClassName,
  footerClassName,
}: CommonModalProps) {
  if (!open) return null;

  const hasFooter = !hideConfirmButton || !hideCancelButton;

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onCancel?.();
    }
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 animate-cloak",
        className,
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "common-modal-title" : undefined}
    >
      <div
        className={clsx(
          "flex max-h-[min(88dvh,720px)] w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl",
          panelClassName,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <div className="border-b border-gray-100 px-6 py-4">
            {typeof title === "string" ? (
              <Text id="common-modal-title" as="h2" size="lg" variant="heading" className="text-gray-900">
                {title}
              </Text>
            ) : (
              <div id="common-modal-title">{title}</div>
            )}
          </div>
        ) : null}

        <div className={clsx("overflow-y-auto px-4 py-5 sm:px-6", contentClassName)}>{children}</div>

        {hasFooter ? (
          <div
            className={clsx(
              "flex flex-col-reverse gap-2 border-t border-gray-100 px-4 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6",
              footerClassName,
            )}
          >
            {!hideCancelButton ? (
              <Button
                color="default"
                variant="outline"
                disabled={cancelDisabled}
                onClick={onCancel}
              >
                {cancelText}
              </Button>
            ) : null}

            {!hideConfirmButton ? (
              <Button color="primary" disabled={confirmDisabled} onClick={onConfirm}>
                {confirmText}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
