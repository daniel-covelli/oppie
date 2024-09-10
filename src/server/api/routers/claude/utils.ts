/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"server-only";

import Anthropic from "@anthropic-ai/sdk";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";
import { type AppContext } from "../../trpc";
import { ResponseType } from "~/definitions";
import { CodeOutputType } from "@prisma/client";

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-3-5-sonnet-20240620";

const SYSTEM =
  "You are a seasoned software engineer. You aren't overly pedantic.";

const PROMPT = `
You are tasked with generating a {{FRAMEWORK}} {{LANGUAGE}}
code styled using {{STYLING_LIBRARY}} based on a user's input description.
Your goal is to create a functional, well-structured component that meets the user's requirements.\n\n

Here's the user's input describing the desired component:\n
<user_input>\n
  {{USER_INPUT}}\n
</user_input>\n\n

Follow these steps to generate the React component:\n\n
1. Analyze the user's input carefully to understand the requirements.\n
2. Determine the necessary props, state, and functionality for the component.\n
3. Structure the component using modern React practices (functional components and hooks).\n
4. Implement the described functionality, including any event handlers or side effects.\n
5. Add appropriate comments to explain complex logic or important parts of the code.\n\n

Adhere to these coding style guidelines:\n
- Use ES6+ syntax\n
- Follow proper indentation and formatting\n
- Use meaningful variable and function names\n
- Implement error handling where appropriate\n
- Ensure the component is reusable and modular\n
- All props should be defined in a interface\n\n

Once you have generated the component, present your code inside <code> tags.
This <code> tag and its contents should be the only thing that is written in your response.
There should be no supplementary text, describing the component or its functionality,
your job is to only provide the code in the <code> tag.
The code that your write should be executable.\n\n

If you need any clarification or additional information about the user's requirements,
state so before generating the component. If you need clarification wrap your clarification in <question> tag.
Otherwise, proceed with creating the React component based on the given input.\n`;

interface MessageInput {
  ctx: AppContext;
  input: string;
}

function multiReplace(input: string, replacements: [string, string][]): string {
  let result = input;
  for (const [search, replace] of replacements) {
    const regex = new RegExp(search, "g");
    result = result.replace(regex, replace);
  }
  return result;
}

const ClaudeContentObjectSchema = z.object({
  type: z.string(),
  text: z.string(),
});

const ClaudeContentsSchema = z.array(ClaudeContentObjectSchema).min(1).max(1);

const getMessage = async ({
  input,
  framework,
  language,
  stylingLibrary,
}: {
  input: string;
  framework: string;
  language: string;
  stylingLibrary: string;
}) => {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1000,
    temperature: 0,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: multiReplace(PROMPT, [
              ["FRAMEWORK", framework],
              ["LANGUAGE", language],
              ["STYLING_LIBRARY", stylingLibrary],
              ["USER_INPUT", input],
            ]),
          },
        ],
      },
    ],
  });
  const { data, success } = ClaudeContentsSchema.safeParse(response.content);
  if (!success) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: "Object could not be parsed",
    });
  }

  const message = data[0]?.text ?? "";

  if (message.startsWith("<question>") && message.endsWith("</question>")) {
    return {
      type: ResponseType.QUESTION,
      message: multiReplace(message, [
        ["<question>", ""],
        ["</question>", ""],
      ]),
    };
  } else if (message.startsWith("<code>") && message.endsWith("</code>")) {
    let trimmed = multiReplace(message, [
      ["<code>", ""],
      ["</code>", ""],
    ]);

    if (trimmed.startsWith("\n")) {
      trimmed = trimmed.slice(1);
    }
    return {
      type: ResponseType.CODE,
      message: trimmed,
    };
  }

  throw new TRPCError({
    code: "UNPROCESSABLE_CONTENT",
    message: "Response object could not be processed",
  });
};

export async function getMessageByCtx({ ctx, input }: MessageInput) {
  return getMessage({
    input,
    framework: ctx.session?.user.framework ?? "",
    language: ctx.session?.user.language ?? "",
    stylingLibrary: ctx.session?.user.stylingLibrary ?? "",
  });
}

interface MessageInputByFile {
  type: CodeOutputType;
  input: string;
}

const TYPE_VALUES: Record<
  CodeOutputType,
  | { framework: "React"; language: "TypeScript"; stylingLibrary: "Tailwind" }
  | { framework: "Python"; language: "Python"; stylingLibrary: "Python" }
> = {
  [CodeOutputType.RTT]: {
    framework: "React",
    language: "TypeScript",
    stylingLibrary: "Tailwind",
  },
  [CodeOutputType.PYTHON]: {
    framework: "Python",
    language: "Python",
    stylingLibrary: "Python",
  },
};

export async function getMessageByFile({ type, input }: MessageInputByFile) {
  return getMessage({
    input,
    ...TYPE_VALUES[type],
  });
}
