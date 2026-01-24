import { Typography, type TypographyProps } from "@mui/material";

type Props = TypographyProps & {
  children: React.ReactNode;
};

export default function SectionTitle({ children, ...props }: Props) {
  return (
    <Typography
      variant="h2"
      fontSize={{
        xs: "22px",
        sm: "25px",
        lg: "30px",
      }}
      mb={1}
      {...props}
    >
      {children}
    </Typography>
  );
}
