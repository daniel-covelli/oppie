/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"server-only";

import Anthropic from "@anthropic-ai/sdk";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";
import { ResponseType } from "~/definitions";
import { CodeOutputType } from "@prisma/client";
import {
  type UserSession,
  userSessionRequiredSchema,
} from "~/definitions/user-session";

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

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

const claudeContentsSchema = z.array(ClaudeContentObjectSchema).min(1).max(1);

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

interface MessageInput {
  input: string;
  framework: string;
  language: string;
  stylingLibrary: string;
}

interface MessageInputByFile {
  type: CodeOutputType;
  input: string;
}

interface MultiReplaceInput {
  replacements: [string, string][];
}

export default class ClaudeService {
  readonly model = "claude-3-5-sonnet-20240620";
  readonly systemPrompt =
    "You are a seasoned software engineer. You aren't overly pedantic.";
  readonly prompt = `
You are tasked with generating a {{FRAMEWORK}} {{LANGUAGE}}
code styled using {{STYLING_LIBRARY}} based on a user's input description.
Your goal is to create a functional, well-structured component that meets the user's requirements.

Here's the user's input describing the desired component:
<user_input>
{{USER_INPUT}}
</user_input>

Follow these steps to generate the React component:
1. Analyze the user's input carefully to understand the requirements.
2. Determine the necessary props, state, and functionality for the code.
3. If react, structure the component using modern React practices (functional components and hooks).
4. Implement the described functionality, including any event handlers or side effects.
5. Add appropriate comments to explain complex logic or important parts of the code.

Adhere to these coding style guidelines:
- Use ES6+ syntax
- Follow proper indentation and formatting
- Use meaningful variable and function names
- Implement error handling where appropriate
- Ensure the component is reusable and modular
- All props should be defined in a interface

Once you have generated the component, present your code inside <code> tags.
This <code> tag and its contents should be the only thing that is written in your response.
There should be no supplementary text, describing the component or its functionality,
your job is to only provide the code in the <code> tag.
The code that your write should be executable.

If you need any clarification or additional information about the user's requirements,
state so before generating the component. If you need clarification wrap your clarification in <question> tag.
Otherwise, proceed with creating the code based on the given input.
`;

  public async getMessageByOutputType({ input, type }: MessageInputByFile) {
    return this.getMessage({
      input,
      ...TYPE_VALUES[type],
    });
  }

  public async getMessageByUserSession({
    user,
    input,
  }: {
    user: UserSession;
    input: string;
  }) {
    const { framework, stylingLibrary, language } =
      userSessionRequiredSchema.parse(user);

    return this.getMessage({
      framework,
      stylingLibrary,
      language,
      input,
    });
  }

  private parseMessage({
    content,
  }: {
    content: Anthropic.Messages.Message["content"];
  }) {
    const data = claudeContentsSchema.parse(content);

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
  }

  private generateClaudeInput({
    text,
  }: {
    text: string;
  }): Anthropic.Messages.MessageCreateParamsNonStreaming {
    return {
      model: this.model,
      max_tokens: 1000,
      temperature: 0,
      system: this.systemPrompt,
      messages: [
        {
          role: "user",
          content: text,
        },
      ],
    };
  }

  private async getMessage({
    framework,
    language,
    stylingLibrary,
    input,
  }: MessageInput) {
    const text = this.interpolatorPrompt({
      replacements: [
        ["FRAMEWORK", framework],
        ["LANGUAGE", language],
        ["STYLING_LIBRARY", stylingLibrary],
        ["USER_INPUT", input],
      ],
    });

    const message = await anthropic.messages.create(
      this.generateClaudeInput({ text }),
    );

    return this.parseMessage(message);
  }

  private interpolatorPrompt({ replacements }: MultiReplaceInput): string {
    let result = this.prompt;
    for (const [search, replace] of replacements) {
      const regex = new RegExp(`{{${search}}}`, "g");
      result = result.replace(regex, replace);
    }
    return result;
  }

  streamMessage() {
    const text = this.interpolatorPrompt({
      replacements: [
        ["FRAMEWORK", "React"],
        ["LANGUAGE", "Typescript"],
        ["STYLING_LIBRARY", "Tailwind"],
        ["USER_INPUT", "Generate button component"],
      ],
    });

    anthropic.messages
      .stream(this.generateClaudeInput({ text }))
      .on("text", (text) => {
        console.log(text);
      });
  }
}

const client = new ClaudeService();

client.streamMessage();
