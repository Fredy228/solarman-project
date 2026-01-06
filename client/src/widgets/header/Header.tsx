"use client";

import { themeConfig } from "@/src/configs/theme.config";
import { Link as NavLink, usePathname } from "@/src/i18n/navigation";
import IconLogoMain from "@/src/shared/ui/icons/IconLogoMain";
import { LanguageSwitcher } from "@/src/shared/ui/language-switcher/LanguageSwitcher";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Collapse,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Link as MUILink,
  Paper,
  Stack,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import HeaderContacts from "./contacts/HeaderContacts";
import { navItemList } from "./navigation.list";

export default function Header() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activeMenuIndex, setActiveMenuIndex] = React.useState<number | null>(
    null
  );
  const [expandedMobile, setExpandedMobile] = React.useState<
    Record<number, boolean>
  >({});
  const t = useTranslations("header");
  const pathname = usePathname();

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveMenuIndex(index);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveMenuIndex(null);
  };

  const toggleMobileExpand = (index: number) => {
    setExpandedMobile((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NavLink href="/">
              <IconLogoMain
                viewBox="0 0 82 32"
                sx={{ height: "42px", width: "auto" }}
              />
            </NavLink>
          </Box>

          {/* Center: Navigation (hidden on small screens) */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              {navItemList(t).map((item, idx) => {
                const IconComp = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.children &&
                    item.children.some((c) => pathname?.startsWith(c.href)));
                return (
                  <Box
                    key={item.label}
                    color={themeConfig.colors.light.text.g4}
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item.children && item.children.length > 0 ? (
                      <>
                        <MUILink
                          component={NavLink}
                          href={item.href}
                          underline="none"
                          color="inherit"
                          aria-haspopup="true"
                          aria-expanded={activeMenuIndex === idx}
                          onMouseEnter={(e) => handleOpenMenu(e, idx)}
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenMenu(e, idx);
                          }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            borderBottom: "2px solid transparent",
                            pb: "6px",
                            color: isActive ? "secondary.main" : "inherit",
                            fontWeight: isActive ? 700 : 500,
                            transition: theme.transitions.create(
                              ["color", "border-bottom-color"],
                              {
                                duration: theme.transitions.duration.shortest,
                              }
                            ),
                            "&:hover": {
                              color: "secondary.main",
                              borderBottomColor: "primary.main",
                            },
                          }}
                        >
                          {IconComp ? <IconComp size={24} /> : null}
                          <ChevronDown size={24} />
                          {item.label}
                        </MUILink>
                        <Popper
                          open={activeMenuIndex === idx}
                          anchorEl={anchorEl}
                          placement="bottom"
                          disablePortal
                          modifiers={[
                            {
                              name: "offset",
                              options: { offset: [0, 8] },
                            },
                          ]}
                        >
                          <Paper
                            elevation={3}
                            onMouseLeave={handleCloseMenu}
                            sx={{
                              borderRadius: themeConfig.styles.borderRadius,
                              minWidth: 250,
                            }}
                          >
                            <List sx={{ py: 0 }}>
                              {item.children.map((child) => {
                                const ChildIcon = child.icon;
                                return (
                                  <ListItem key={child.label} disablePadding>
                                    <ListItemButton
                                      component={NavLink}
                                      href={child.href}
                                      onClick={handleCloseMenu}
                                      sx={{
                                        gap: 1,
                                        "&:hover": {
                                          color: "primary.main",
                                        },
                                      }}
                                    >
                                      {ChildIcon ? (
                                        <ChildIcon
                                          size={24}
                                          className="child-icon"
                                          color="currentColor"
                                        />
                                      ) : null}
                                      <ListItemText primary={child.label} />
                                    </ListItemButton>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </Paper>
                        </Popper>
                      </>
                    ) : (
                      <MUILink
                        component={NavLink}
                        href={item.href}
                        underline="none"
                        color="inherit"
                        onMouseEnter={handleCloseMenu}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          borderBottom: "2px solid transparent",
                          pb: "6px",
                          color: isActive ? "secondary.main" : "inherit",
                          fontWeight: isActive ? 700 : 500,
                          transition: theme.transitions.create(
                            ["color", "border-bottom-color"],
                            {
                              duration: theme.transitions.duration.shortest,
                            }
                          ),
                          "&:hover": {
                            color: "secondary.main",
                            borderBottomColor: "primary.main",
                          },
                        }}
                      >
                        {IconComp ? <IconComp size={24} /> : null}
                        {item.label}
                      </MUILink>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* Right: Language Switcher */}
          {isMdUp && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LanguageSwitcher />
            </Box>
          )}

          {/* Right: Contacts or menu button on mobile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMdUp ? (
              <HeaderContacts isMobile={false} />
            ) : (
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpen(true)}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 280, p: 2, height: "100%" }} role="presentation">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <LanguageSwitcher />
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            <List>
              {navItemList(t).map((item, idx) => {
                const isActive =
                  pathname === item.href ||
                  (item.children &&
                    item.children.some((c) => pathname?.startsWith(c.href)));
                return (
                  <React.Fragment key={item.label}>
                    <ListItem disablePadding>
                      {item.children && item.children.length > 0 ? (
                        <ListItemButton
                          onClick={() => toggleMobileExpand(idx)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: isActive ? "secondary.main" : "inherit",
                            fontWeight: isActive ? 700 : 400,
                          }}
                        >
                          <ListItemText primary={item.label} />
                          {expandedMobile[idx] ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </ListItemButton>
                      ) : (
                        <ListItemButton
                          component={NavLink}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: isActive ? "secondary.main" : "inherit",
                            fontWeight: isActive ? 700 : 400,
                          }}
                        >
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      )}
                    </ListItem>
                    {item.children && item.children.length > 0 && (
                      <Collapse
                        in={!!expandedMobile[idx]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {item.children.map((child) => {
                            return (
                              <ListItem
                                key={child.label}
                                sx={{ pl: 4 }}
                                disablePadding
                              >
                                <ListItemButton
                                  component={NavLink}
                                  href={child.href}
                                  onClick={() => setOpen(false)}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <ListItemText primary={child.label} />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
            <Divider sx={{ my: 1 }} />
            <HeaderContacts isMobile={true} />
          </Box>
        </Drawer>
      </Container>
    </AppBar>
  );
}
