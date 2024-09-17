import { tsxLanguage } from "@codemirror/lang-javascript";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { myTheme } from "../_configs";
import { CodeOutputType } from "@prisma/client";
import { pythonLanguage } from "@codemirror/lang-python";

const extensions = {
  [CodeOutputType.RTT]: [tsxLanguage],
  [CodeOutputType.PYTHON]: [pythonLanguage],
};

export default function CodeDisplay({
  value,
  type,
}: {
  value: string;
  type: CodeOutputType;
}) {
  const parsedValue = value.replace("<code>", "").replace("</code>", "");
  return (
    <CodeMirror
      readOnly
      value={parsedValue}
      extensions={[...extensions[type], EditorView.lineWrapping]}
      theme={myTheme}
    />
  );
}
