"use client";

import { Dialog, DialogTitle, IconButton } from "@mui/material";
import { PhoneCall, X } from "lucide-react";
import { usePathname } from "next/navigation";
import SendRequest from "./SendRequest";
import { useSendRequestStore } from "./store/useSendRequestStore";

export default function SendRequestModal() {
  const { open, openModal, closeModal } = useSendRequestStore();
  const pathname = usePathname();
  const isQuizPage = pathname.includes("/quiz");

  return (
    <>
      <IconButton
        size="large"
        sx={{
          position: "fixed",
          bottom: {
            xs: isQuizPage ? "116px" : "60px",
            md: "60px",
          },
          right: "20px",
          backgroundColor: "primary.main",
          color: "white",
          boxShadow: 3,
          "&:hover": {
            backgroundColor: "primary.dark",
            boxShadow: 6,
          },
        }}
        onClick={(e) => {
          (e.currentTarget as HTMLElement).blur();
          openModal();
        }}
      >
        <PhoneCall />
      </IconButton>
      <Dialog
        open={open}
        onClose={closeModal}
        maxWidth="xs"
        fullWidth
        disableScrollLock
        slotProps={{
          paper: {
            sx: {
              borderRadius: "var(--border-radius-main)",
            },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <X size={24} />
          </IconButton>
        </DialogTitle>
        <SendRequest />
      </Dialog>
    </>
  );
}
