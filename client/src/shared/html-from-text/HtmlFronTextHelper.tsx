import { FormHelperText } from "@mui/material";

export const HtmlFromTextHelper = () => {
  return (
    <FormHelperText>
      Форматування: <b>**жирний**</b>, <i>__курсив__</i>, <br />
      Списки: починай строку с &quot; - &quot; (дефіс та пробіл). <br />
      Абзац: просто пуста строка між текстом.
    </FormHelperText>
  );
};
