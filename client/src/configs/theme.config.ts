import type { LucideProps } from "lucide-react";

export const themeConfig = {
  colors: {
    primary: {
      main: "#FC7300",
    },
    secondary: {
      main: "#16498a",
    },
    light: {
      text: {
        light: "#FFFFFF",
        g1: "#111827",
        g2: "#02244D",
        g3: "#505F7C",
        g4: "#6B7280",
        g5: "#9CA3AF",
        g6: "#E5E7EB",
      },
    },
  },
  styles: {
    borderRadius: "10px",
    fontWeight: 500,
    icon: {
      size: 20,
    } as LucideProps,
  },
  fonts: {
    fontFamily: "var(--font-montserrat)",
  },
};
