"use client";

import { signOut } from "next-auth/react";
import Button from "../components/button";
import { api } from "~/trpc/react";

import { usePathname, useRouter } from "next/navigation";
import {
  type FormEvent,
  Fragment,
  type MouseEventHandler,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { tsxLanguage } from "@codemirror/lang-javascript";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { ResponseType } from "~/definitions";
import HomeSolid from "../components/svgs/home-solid";
import Interactive from "../components/interactive";
import { myTheme } from "../_configs";
import { type RecursiveFolderProps } from "./components/folder";
import Chevron from "../components/svgs/chevron";
import Link from "next/link";
import FolderOpenSolid from "../components/svgs/folder-open-solid";
import FileIconSolid from "../components/svgs/file-solid";
import Loading from "../components/svgs/spinner";

export function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign out</Button>;
}

const useBreadCrumbLoading = (callback: () => Promise<void>) => {
  const [isTransitioning, startTransition] = useTransition();

  const handleMutation = useCallback(async () => {
    startTransition(async () => {
      await callback();
    });
  }, [callback]);

  return { handleMutation, isPending: isTransitioning };
};

export function SelectReactButton() {
  const utils = api.useUtils();
  const router = useRouter();
  const { mutateAsync } = api.session.updateSession.useMutation();
  const { handleMutation, isPending } = useBreadCrumbLoading(async () => {
    await mutateAsync();
    await utils.session.getClaudeSession.invalidate();
    router.refresh();
  });

  return isPending ? (
    <div className="flex justify-center">
      <Loading className="size-4" />
    </div>
  ) : (
    <Button color="secondary" onClick={handleMutation}>
      Select
    </Button>
  );
}
interface UseBreadCrumbsResponseType {
  key: string;
  text: string;
  icon?: React.ComponentType;
  onClick?: () => Promise<void>;
  href: string;
}
interface BreadCrumbsProps {
  folders: RecursiveFolderProps[];
}

const useManageBreadCrumbs = ({
  folders,
  handleMutation,
  isSessionEstablished,
}: BreadCrumbsProps & {
  handleMutation: () => Promise<void>;
  isSessionEstablished: boolean;
}): UseBreadCrumbsResponseType[] => {
  const [breadCrumbs, setBreadCrumbs] = useState<UseBreadCrumbsResponseType[]>(
    [],
  );
  const pathName = usePathname();

  const handleConstructBreadCrumbs = useCallback(
    (
      pathName: string,
      folders: RecursiveFolderProps[],
      isSessionEstablished: boolean,
    ): UseBreadCrumbsResponseType[] => {
      const baseBreadCrumbs: UseBreadCrumbsResponseType[] = [
        {
          key: "home",
          text: "Home",
          icon: () => <HomeSolid className="size-3" />,
          onClick: async () => {
            await handleMutation();
          },
          href: "/",
        },
      ];

      if (pathName === "/") {
        return [
          ...baseBreadCrumbs,
          ...(isSessionEstablished
            ? [
                {
                  key: "generate",
                  text: "Generate",
                  href: "/",
                },
              ]
            : []),
        ];
      }

      const findBreadCrumbs = (
        currentPath: string,
        currentFolders: RecursiveFolderProps[],
        accumulator: UseBreadCrumbsResponseType[] = [],
      ): UseBreadCrumbsResponseType[] => {
        for (const folder of currentFolders) {
          const newAccumulator: UseBreadCrumbsResponseType[] = [
            ...accumulator,
            {
              key: folder.id,
              text: folder.heading.content ?? "",
              href: `/folder/${folder.id}`,
              icon: () => <FolderOpenSolid className="size-3" />,
            },
          ];
          if (currentPath.includes(folder.id)) {
            return newAccumulator;
          }

          const childResult = findBreadCrumbs(
            currentPath,
            folder.children,
            newAccumulator,
          );
          if (childResult.length > newAccumulator.length) {
            return childResult;
          }

          const file = folder.files.find((file) =>
            currentPath.includes(file.id),
          );
          if (file) {
            return [
              ...newAccumulator,
              {
                key: file.id,
                text: file.heading.content ?? "",
                href: `/document/${file.id}`,
                icon: () => <FileIconSolid className="size-3" />,
              },
            ];
          }
        }
        return accumulator;
      };

      const pathBreadCrumbs = findBreadCrumbs(pathName, folders);

      return [...baseBreadCrumbs, ...pathBreadCrumbs];
    },
    [handleMutation],
  );

  useEffect(() => {
    setBreadCrumbs(
      handleConstructBreadCrumbs(pathName, folders, isSessionEstablished),
    );
  }, [folders, handleConstructBreadCrumbs, isSessionEstablished, pathName]);

  return breadCrumbs;
};

export function BreadCrumbs({ folders }: BreadCrumbsProps) {
  const utils = api.useUtils();
  const router = useRouter();
  const { mutateAsync } = api.session.removeSession.useMutation();

  const { data, isPending: isSessionPending } =
    api.session.getClaudeSession.useQuery();

  const { handleMutation, isPending } = useBreadCrumbLoading(
    useCallback(async () => {
      await mutateAsync();
      await utils.session.getClaudeSession.invalidate();
      router.refresh();
    }, [mutateAsync, router, utils.session.getClaudeSession]),
  );
  const breadCrumbs = useManageBreadCrumbs({
    folders,
    handleMutation,
    isSessionEstablished: data ?? false,
  });

  return isPending || isSessionPending ? (
    <div className="h-4 w-10 animate-pulse rounded bg-slate-700" />
  ) : (
    breadCrumbs.map(
      (
        { key, onClick, icon: Icon = () => <Fragment />, text, href },
        index,
      ) => (
        <Fragment key={key}>
          {index > 0 && index < breadCrumbs.length && (
            <Chevron className="size-2 rotate-180" /> // Adjust className as needed
          )}
          <Button
            as={Link}
            className="px-0"
            href={href}
            size="sm"
            icon
            variant="transparent"
            onClick={onClick}
          >
            <Icon />
            {text}
          </Button>
        </Fragment>
      ),
    )
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
