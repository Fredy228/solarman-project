import { parseImageUrl } from "@/src/libs/parse-image-url";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Box,
  Checkbox,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import Image from "next/image";

type StyledText = {
  type: "text" | "link";
  text: string;
  href?: string;
  content?: StyledText[];
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
        if (!segment || typeof segment !== "object") return null;

        const safeStyles = segment.styles ?? {};

        // Базовые стили через sx
        const style: any = {
          fontWeight: safeStyles.bold ? 700 : "inherit",
          fontStyle: safeStyles.italic ? "italic" : "inherit",
          textDecoration: [
            safeStyles.underline ? "underline" : "",
            safeStyles.strike ? "line-through" : "",
          ]
            .filter(Boolean)
            .join(" "),
          color: "inherit",
          backgroundColor: safeStyles.backgroundColor || "transparent",
        };

        // Если это Inline Code
        if (safeStyles.code) {
          style.fontFamily = "monospace";
          style.backgroundColor = "#f0f0f0";
          style.padding = "2px 4px";
          style.borderRadius = "4px";
        }

        const hasText =
          typeof segment.text === "string" && segment.text.trim().length > 0;
        const displayText = hasText ? segment.text : (segment.href ?? "");

        const textElement = (
          <Box component="span" sx={style} key={index}>
            {displayText}
          </Box>
        );

        // Если это ссылка (BlockNote может хранить текст в segment.content)
        if (segment.type === "link" && segment.href) {
          return (
            <Link
              key={index}
              href={segment.href}
              sx={{
                ...style,
                display: "inline",
                color: "primary.main",
                textDecoration: "underline",
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {segment.content && Array.isArray(segment.content) ? (
                <InlineContent content={segment.content} />
              ) : (
                displayText
              )}
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

  const headingSizes: Record<
    number,
    { xs: string; sm?: string; md?: string; lg?: string }
  > = {
    1: { xs: "25px", md: "30px", lg: "40px" },
    2: { xs: "22px", sm: "25px", lg: "30px" },
    3: { xs: "20px", sm: "22px", lg: "25px" },
  };

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
          sx={{ mb: 2, minHeight: "1.5em", ml: marginLeft, color: "inherit" }}
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
          sx={{
            mt: 4,
            mb: 2,
            fontWeight: 700,
            ml: marginLeft,
            color: "inherit",
            fontSize: headingSizes[block.props.level],
          }}
        >
          <InlineContent content={block.content} />
        </Typography>
      );

    case "bulletListItem":
      return (
        <Box sx={{ ml: marginLeft }}>
          <List dense disablePadding>
            <ListItem alignItems="center" sx={{ pl: 0 }}>
              <ListItemIcon
                sx={{ minWidth: "24px", mt: 0, alignSelf: "center" }}
              >
                <CircleIcon sx={{ fontSize: 8, color: "primary.main" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ color: "inherit" }}
                  >
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
            <Typography variant="body1" sx={{ color: "inherit" }}>
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
                color: "inherit",
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
              align="center"
              sx={{ mt: 1, display: "block", color: "inherit" }}
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
                      sx={{
                        borderRight: 1,
                        borderColor: "divider",
                        textAlign: cell?.props?.textAlignment || "left",
                        backgroundColor:
                          cell?.props?.backgroundColor !== "default"
                            ? cell?.props?.backgroundColor
                            : "inherit",
                        color: "inherit",
                      }}
                    >
                      {/* Ячейка содержит массив StyledText внутри cell.content */}
                      <InlineContent content={cell?.content || []} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );

    case "quote":
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
          <Typography
            variant="body1"
            sx={{ fontStyle: "italic", color: "inherit" }}
          >
            <InlineContent content={block.content} />
          </Typography>
        </Box>
      );

    case "codeBlock":
      return (
        <Box
          component={Paper}
          variant="outlined"
          sx={{ p: 2, my: 2, bgcolor: "grey.50", overflowX: "auto" }}
        >
          <Typography
            component="pre"
            sx={{
              m: 0,
              fontFamily: "monospace",
              fontSize: 14,
              color: "inherit",
            }}
          >
            <InlineContent content={block.content} />
          </Typography>
        </Box>
      );

    case "divider":
      return (
        <Box
          component="hr"
          sx={{ my: 3, border: 0, borderTop: 1, borderColor: "divider" }}
        />
      );

    default:
      console.warn(`Unsupported block type: ${block.type}`);
      return null;
  }
};

interface ViewerProps {
  content: Block[] | null;
}

export default function MuiBlockNoteViewer({ content }: ViewerProps) {
  if (!content) return null;

  return (
    <Box
      sx={{
        width: "100%",
        color: "var(--color-text-g2)",
      }}
    >
      {content.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </Box>
  );
}
