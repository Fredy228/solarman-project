"use client";

import { Dialog, DialogTitle, IconButton } from "@mui/material";
import { PhoneCall, X } from "lucide-react";
import { useState } from "react";
import SendRequest from "./SendRequest";

export default function SendRequestModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        size="large"
        sx={{
          position: "fixed",
          bottom: "60px",
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
          setOpen(true);
        }}
      >
        <PhoneCall />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
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
            onClick={() => setOpen(false)}
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
