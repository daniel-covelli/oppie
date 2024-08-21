"use client";

import { signOut } from "next-auth/react";
import Button from "../_components/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { type FormEvent, type MouseEventHandler, useState } from "react";
import { tsxLanguage } from "@codemirror/lang-javascript";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { ResponseType } from "~/definitions";
import HomeSolid from "../_components/svgs/home-solid";
import Interactive from "../_components/interactive";
import { myTheme } from "../_configs";

export function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign out</Button>;
}

export function SelectReactButton() {
  const router = useRouter();
  const updateSession = api.session.updateSession.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <Button color="secondary" onClick={() => updateSession.mutate()}>
      {updateSession.isPending ? "Loading..." : "Select"}
    </Button>
  );
}

export function HomeButton({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  const removeSession = api.session.removeSession.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <Button
      disabled={disabled}
      size="sm"
      icon
      variant="transparent"
      onClick={() => removeSession.mutate()}
    >
      <HomeSolid className="size-3" />
      Home
    </Button>
  );
}

const AddButton = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  return (
    <Button color="secondary" className="w-fit" onClick={onClick}>
      New chat
    </Button>
  );
};

export function Message() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { mutate, data, error } = api.claude.getMessage.useMutation();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    setSubmitted(true);
    mutate({ input });
  };

  const handleAdd = () => {
    setSubmitted(false);
    setInput("");
  };
  console.log("data.message", JSON.stringify(data?.message, null, 2));

  return (
    <div>
      {!submitted ? (
        <Interactive
          as="form"
          onSubmit={onSubmit}
          footer={() => (
            <Button
              disabled={!input}
              type="submit"
              color="secondary"
              className="w-fit"
              size="lg"
            >
              Submit
            </Button>
          )}
        >
          <textarea
            rows={5}
            className="resize-none bg-slate-900 px-1 ring-offset-0 focus:outline-none"
            placeholder="What component would you like to build today?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Interactive>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-slate-750 p-4">{input}</div>
          {data ? (
            <>
              {data.type === ResponseType.QUESTION ? (
                <Interactive footer={() => <AddButton onClick={handleAdd} />}>
                  <p>{data.message}</p>
                </Interactive>
              ) : (
                <Interactive footer={() => <AddButton onClick={handleAdd} />}>
                  <div className="absolute right-0 z-10">
                    <div className="pb-50 flex flex-row justify-end gap-4 from-slate-900 from-60% p-4 pl-40">
                      <Button
                        onClick={async () => {
                          setCopied(true);
                          await navigator.clipboard.writeText(data.message);
                        }}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <Button>Save</Button>
                    </div>
                  </div>
                  <CodeMirror
                    id="code-block"
                    readOnly
                    value={data.message}
                    extensions={[tsxLanguage, EditorView.lineWrapping]}
                    theme={myTheme}
                  />
                </Interactive>
              )}
            </>
          ) : (
            <div className="h-[400px] animate-pulse rounded-lg bg-slate-700" />
          )}
        </div>
      )}

      {error && <p>Something went wrong</p>}
    </div>
  );
}
