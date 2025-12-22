import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { parseImageUrl } from "@/src/libs/parse-image-url";

// --- ТИПЫ (Упрощенные для BlockNote) ---
type StyledText = {
  type: "text" | "link";
  text: string;
  href?: string;
  styles: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    code?: boolean;
    textColor?: string;
    backgroundColor?: string;
  };
};

type Block = {
  id: string;
  type: string;
  props: Record<string, any>;
  content: StyledText[] | any;
  children: Block[];
};

// --- КОМПОНЕНТ РЕНДЕРИНГА ТЕКСТА ---
// Отвечает за <b>, <i>, <a>, цвета и span
const InlineContent = ({ content }: { content: StyledText[] }) => {
  if (!content || !Array.isArray(content)) return null;

  return (
    <>
      {content.map((segment, index) => {
        // Базовые стили через sx
        const style: any = {
          fontWeight: segment.styles.bold ? "bold" : "normal",
          fontStyle: segment.styles.italic ? "italic" : "normal",
          textDecoration: [
            segment.styles.underline ? "underline" : "",
            segment.styles.strike ? "line-through" : "",
          ]
            .filter(Boolean)
            .join(" "),
          color: segment.styles.textColor || "inherit",
          backgroundColor: segment.styles.backgroundColor || "transparent",
        };

        // Если это Inline Code
        if (segment.styles.code) {
          style.fontFamily = "monospace";
          style.backgroundColor = "#f0f0f0";
          style.padding = "2px 4px";
          style.borderRadius = "4px";
        }

        const textElement = (
          <Box component="span" sx={style} key={index}>
            {segment.text}
          </Box>
        );

        // Если это ссылка
        if (segment.href) {
          return (
            <Link key={index} href={segment.href} passHref legacyBehavior>
              <Box
                component="a"
                sx={{
                  ...style,
                  color: "primary.main",
                  textDecoration: "underline",
                  cursor: "pointer",
                  "&:hover": { opacity: 0.8 },
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {segment.text}
              </Box>
            </Link>
          );
        }

        return textElement;
      })}
    </>
  );
};

// --- РЕНДЕРЕР ОТДЕЛЬНОГО БЛОКА ---
const BlockRenderer = ({ block }: { block: Block }) => {
  // Общие пропсы для выравнивания текста
  const alignment = block.props.textAlignment || "left";

  // Отступы для вложенности (если BlockNote не использует children для отступа)
  const marginLeft = block.props.indent
    ? `${block.props.indent * 20}px`
    : "0px";

  switch (block.type) {
    case "paragraph":
      return (
        <Typography
          variant="body1"
          align={alignment}
          sx={{ mb: 2, minHeight: "1.5em", ml: marginLeft }}
        >
          {block.content && block.content.length > 0 ? (
            <InlineContent content={block.content} />
          ) : (
            <br /> /* Пустой параграф */
          )}
        </Typography>
      );

    case "heading":
      // Маппинг уровней: h1 -> h2 (чтобы не конфликтовать с title страницы), h2 -> h3
      const levels: Record<number, "h1" | "h2" | "h3" | "h4"> = {
        1: "h2",
        2: "h3",
        3: "h4",
      };
      const variant = levels[block.props.level] || "h6";

      return (
        <Typography
          variant={variant}
          align={alignment}
          sx={{ mt: 4, mb: 2, fontWeight: "bold", ml: marginLeft }}
        >
          <InlineContent content={block.content} />
        </Typography>
      );

    case "bulletListItem":
      return (
        <Box sx={{ ml: marginLeft }}>
          <List dense disablePadding>
            <ListItem alignItems="flex-start" sx={{ pl: 0 }}>
              <ListItemIcon sx={{ minWidth: "24px", mt: "8px" }}>
                <CircleIcon sx={{ fontSize: 8 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" component="div">
                    <InlineContent content={block.content} />
                  </Typography>
                }
              />
            </ListItem>
            {/* Рекурсия для вложенных списков */}
            {block.children && block.children.length > 0 && (
              <Box sx={{ pl: 4 }}>
                {block.children.map((child) => (
                  <BlockRenderer key={child.id} block={child} />
                ))}
              </Box>
            )}
          </List>
        </Box>
      );

    case "numberedListItem":
      // Для нумерованного списка в BlockNote сложнее получить индекс,
      // если блоки идут не подряд. Здесь упрощенный вариант.
      // В идеале нумерацию нужно считать на уровне родителя.
      return (
        <Box sx={{ ml: marginLeft, display: "flex", mb: 1 }}>
          <Typography sx={{ mr: 1, fontWeight: "bold" }}>•</Typography>{" "}
          {/* Или использовать index если доступен */}
          <Box>
            <Typography variant="body1">
              <InlineContent content={block.content} />
            </Typography>
            {block.children && (
              <Box sx={{ pl: 2 }}>
                {block.children.map((child) => (
                  <BlockRenderer key={child.id} block={child} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      );

    case "checkListItem":
      return (
        <Box sx={{ ml: marginLeft }}>
          <ListItem dense disablePadding alignItems="flex-start">
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <Checkbox
                edge="start"
                checked={block.props.checked}
                readOnly
                tabIndex={-1}
                disableRipple
                size="small"
              />
            </ListItemIcon>
            <ListItemText
              sx={{
                textDecoration: block.props.checked ? "line-through" : "none",
                opacity: block.props.checked ? 0.6 : 1,
              }}
              primary={<InlineContent content={block.content} />}
            />
          </ListItem>
          {block.children && block.children.length > 0 && (
            <Box sx={{ pl: 4 }}>
              {block.children.map((child) => (
                <BlockRenderer key={child.id} block={child} />
              ))}
            </Box>
          )}
        </Box>
      );

    case "image":
      const { src, width, height } = parseImageUrl(block.props.url);
      const alignMap: Record<string, string> = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      };

      return (
        <Box
          component="figure"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: alignMap[block.props.textAlignment] || "center",
            my: 4,
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: block.props.previewWidth || width, // Если есть previewWidth (resize), берем его
              maxWidth: "100%",
              height: "auto",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 1,
            }}
          >
            <Image
              src={src}
              alt={block.props.caption || "Image"}
              width={width}
              height={height}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
              sizes="(max-width: 768px) 100vw, 800px"
              placeholder="empty"
            />
          </Box>
          {block.props.caption && (
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ mt: 1, display: "block" }}
            >
              {block.props.caption}
            </Typography>
          )}
        </Box>
      );

    // Блок таблицы (BlockNote Table Block)
    case "table":
      // content в таблице - это JSON объект: { type: "tableContent", rows: [...] }
      const rows = block.content?.rows || [];
      if (!rows.length) return null;

      return (
        <TableContainer component={Paper} variant="outlined" sx={{ my: 3 }}>
          <Table size="small">
            <TableBody>
              {rows.map((row: any, rIndex: number) => (
                <TableRow key={rIndex}>
                  {row.cells.map((cell: any, cIndex: number) => (
                    <TableCell
                      key={cIndex}
                      sx={{ borderRight: 1, borderColor: "divider" }}
                    >
                      {/* Ячейка содержит массив StyledText, как обычный блок */}
                      <InlineContent content={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );

    case "blockquote": // Цитаты
      return (
        <Box
          sx={{
            borderLeft: "4px solid",
            borderColor: "primary.main",
            pl: 2,
            py: 1,
            my: 2,
            bgcolor: "action.hover",
            borderRadius: "0 4px 4px 0",
          }}
        >
          <Typography variant="body1" sx={{ fontStyle: "italic" }}>
            <InlineContent content={block.content} />
          </Typography>
        </Box>
      );

    default:
      console.warn(`Unsupported block type: ${block.type}`);
      return null;
  }
};

// --- ГЛАВНЫЙ ЭКСПОРТ ---
interface ViewerProps {
  content: Block[] | null;
}

export default function MuiBlockNoteViewer({ content }: ViewerProps) {
  if (!content) return null;

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto", p: 2 }}>
      {content.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </Box>
  );
}
