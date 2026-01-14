import { Typography, type TypographyProps } from "@mui/material";

type Props = TypographyProps & {
  children: React.ReactNode;
};

export default function PageTitle({ children, ...props }: Props) {
  return (
    <Typography
      variant="h1"
      component={"h1"}
      fontSize={{ xs: "25px", md: "30px", lg: "40px" }}
      {...props}
    >
      {children}
    </Typography>
  );
}
