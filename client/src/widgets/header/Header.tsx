"use client";

import { useCartStore } from "@/src/features/cart/store/useCartStore";
import type { TContacts } from "@/src/features/global-params";
import { Link as NavLink, usePathname } from "@/src/i18n/navigation";
import IconLogoMain from "@/src/shared/ui/icons/IconLogoMain";
import { LanguageSwitcher } from "@/src/shared/ui/language-switcher/LanguageSwitcher";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Badge,
  Box,
  ClickAwayListener,
  Collapse,
  Container,
  Divider,
  Drawer,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Link as MUILink,
  Paper,
  Stack,
  Toolbar,
} from "@mui/material";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useLayoutEffect, useState, useSyncExternalStore } from "react";
import HeaderContacts from "./contacts/HeaderContacts";
import { navItemList } from "./navigation.list";

type Props = {
  contactsData: TContacts | null;
};

export default function Header({ contactsData }: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<Record<number, boolean>>(
    {},
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const isCartHydrated = useSyncExternalStore(
    (onStoreChange) => useCartStore.persist.onFinishHydration(onStoreChange),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
  const t = useTranslations("header");
  const pathname = usePathname();
  const isProductsPage = pathname ? pathname.includes("/products") : false;
  const cartCount = useCartStore((state) => state.getCount());

  useLayoutEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
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
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        maxWindth: "xl",
        borderBottom: isScrolled ? 1 : 0,
        borderColor: "divider",
        backgroundColor: isScrolled ? "background.paper" : "transparent",
        transition: theme.transitions.create(
          ["background-color", "border-bottom-color"],
          { duration: theme.transitions.duration.shorter },
        ),
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          className="p-0!"
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
                    color="var(--color-text-g4)"
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
                            borderBottomColor: isActive
                              ? "primary.main"
                              : "transparent",
                            color: isActive ? "secondary.main" : "inherit",
                            fontWeight: isActive ? 700 : 500,
                            transition: theme.transitions.create(
                              ["color", "border-bottom-color"],
                              {
                                duration: theme.transitions.duration.shortest,
                              },
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
                          transition
                          modifiers={[
                            {
                              name: "offset",
                              options: { offset: [0, 8] },
                            },
                          ]}
                        >
                          {({ TransitionProps }) => (
                            <Grow {...TransitionProps} timeout={150}>
                              <Box>
                                <ClickAwayListener
                                  onClickAway={handleCloseMenu}
                                >
                                  <Paper
                                    elevation={3}
                                    onMouseLeave={handleCloseMenu}
                                    sx={{
                                      borderRadius: "var(--border-radius-main)",
                                      minWidth: 250,
                                    }}
                                  >
                                    <List sx={{ py: 0 }}>
                                      {item?.children?.map((child) => {
                                        const ChildIcon = child.icon;
                                        return (
                                          <ListItem
                                            key={child.label}
                                            disablePadding
                                          >
                                            <ListItemButton
                                              component={NavLink}
                                              href={child.href}
                                              onClick={handleCloseMenu}
                                              sx={{
                                                gap: 1,
                                                color: "var(--color-text-g2)",
                                                "&:hover": {
                                                  color: "var(--color-primary)",
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
                                              <ListItemText
                                                primary={child.label}
                                              />
                                            </ListItemButton>
                                          </ListItem>
                                        );
                                      })}
                                    </List>
                                  </Paper>
                                </ClickAwayListener>
                              </Box>
                            </Grow>
                          )}
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
                          borderBottomColor: isActive
                            ? "primary.main"
                            : "transparent",
                          color: isActive ? "secondary.main" : "inherit",
                          fontWeight: isActive ? 700 : 500,
                          transition: theme.transitions.create(
                            ["color", "border-bottom-color"],
                            {
                              duration: theme.transitions.duration.shortest,
                            },
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

          {/* Right: Language Switcher (desktop only) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {isProductsPage ? (
              <IconButton
                component={NavLink}
                href="/cart"
                aria-label="cart"
                color="inherit"
                data-cart-icon
                sx={{
                  p: 0.5,
                  color: "var(--color-text-g3)",
                  "&:hover": { color: "var(--color-primary)" },
                }}
              >
                <Badge
                  color="primary"
                  badgeContent={isCartHydrated ? cartCount : 0}
                  overlap="circular"
                  invisible={!isCartHydrated || cartCount === 0}
                  sx={{ "& .MuiBadge-badge": { color: "#fff" } }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            ) : null}
            <LanguageSwitcher />
          </Box>

          {/* Right: Contacts (desktop) or menu button (mobile) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Desktop: contacts */}
            {contactsData && (
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <HeaderContacts isMobile={false} contactsData={contactsData} />
              </Box>
            )}
            {/* Mobile: cart + menu button */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {isProductsPage ? (
                <IconButton
                  component={NavLink}
                  href="/cart"
                  aria-label="cart"
                  color="inherit"
                  onClick={() => setOpen(false)}
                  data-cart-icon
                  sx={{
                    p: 0.5,
                    color: "var(--color-text-g3)",
                    "&:hover": { color: "var(--color-primary)" },
                  }}
                >
                  <Badge
                    color="primary"
                    badgeContent={isCartHydrated ? cartCount : 0}
                    overlap="circular"
                    invisible={!isCartHydrated || cartCount === 0}
                    sx={{ "& .MuiBadge-badge": { color: "#fff" } }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              ) : null}
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpen(true)}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ disableScrollLock: true }}
        >
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
            {contactsData && (
              <HeaderContacts isMobile={true} contactsData={contactsData} />
            )}
          </Box>
        </Drawer>
      </Container>
    </AppBar>
  );
}
