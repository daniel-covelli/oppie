import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

export const myTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#0f172a",
    backgroundImage: "",
    foreground: "#7dd3fc",
    caret: "#fff",
    selection: "#075985",
    selectionMatch: "#075985",
    lineHighlight: "#1e293b",
    gutterBorder: "1px solid #",
    gutterBackground: "#0f172a",
  },
  styles: [
    { tag: t.comment, color: "#0d9488" },
    { tag: t.variableName, color: "#7dd3fc" },
    { tag: t.string, color: "#fcd34d" },
    { tag: t.bracket, color: "#a855f7" },
    { tag: t.paren, color: "#fde047" },
    { tag: t.separator, color: "#cbd5e1" },
    { tag: t.number, color: "#0ea5e9" },
    { tag: t.bool, color: "#0284c7" },
    { tag: t.null, color: "#0ea5e9" },
    { tag: t.keyword, color: "#a855f7" },
    { tag: t.operator, color: "#cbd5e1" },
    { tag: t.className, color: "#0ea5e9" },
    { tag: t.typeName, color: "#0ea5e9" },
    { tag: t.angleBracket, color: "#0ea5e9" },
    { tag: t.tagName, color: "#0ea5e9" },
    { tag: t.attributeName, color: "#0ea5e9" },
  ],
});
