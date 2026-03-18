"use client";

import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutHeaderProps } from "@refinedev/mui";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ADMIN_PROTECTED_ROUTES } from "@/src/configs/routes.config";
import { TUserAuth } from "@/src/features/user";
import { useRouter } from "@/src/i18n/navigation";
import { LanguageSwitcher } from "@/src/shared/ui/language-switcher/LanguageSwitcher";

export const CustomHeader: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky,
}) => {
  const t = useTranslations("refine");
  const router = useRouter();
  const { data: identity } = useGetIdentity<TUserAuth>();
  const { mutate: logout } = useLogout();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleChangePassword = () => {
    handleClose();
    router.push(ADMIN_PROTECTED_ROUTES.changePassword);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar
      position={sticky ? "sticky" : "relative"}
      color="default"
      elevation={1}
      sx={{ backgroundColor: "primary" }}
    >
      <Toolbar>
        <HamburgerMenu />

        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
          gap={2}
        >
          <LanguageSwitcher />

          <Tooltip title={identity?.name ?? identity?.email ?? ""}>
            <IconButton onClick={handleOpen} size="small">
              <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                {(identity?.name ?? identity?.email ?? "A")[0].toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {identity && (
              <MenuItem disabled>
                <Typography variant="caption" color="text.secondary">
                  {identity.email}
                </Typography>
              </MenuItem>
            )}
            <MenuItem onClick={handleChangePassword}>
              <ListItemIcon>
                <LockResetIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("change-password.title")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("buttons.logout")}</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
