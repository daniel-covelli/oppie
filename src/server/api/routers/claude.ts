import { z } from "zod";

import { createTRPCRouter, promptingProcedure } from "~/server/api/trpc";

import Anthropic from "@anthropic-ai/sdk";
import { env } from "~/env";

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

const GetMessageSchema = z.object({
  userInput: z.string(),
});

const ClaudeContentObjectSchema = z.object({
  type: z.string(),
  text: z.string(),
});

const ClaudeContentsSchema = z.array(ClaudeContentObjectSchema).min(1).max(1);

export const claudeRouter = createTRPCRouter({
  getMessage: promptingProcedure
    .input(GetMessageSchema)
    .query(async ({ ctx, input: { userInput } }) => {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        temperature: 0,
        system:
          "You are a seasoned software engineer. You aren't overly pedantic.",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are tasked with generating a {{${ctx.session.user.framework}}} {{${ctx.session.user.language}}} code styled using {{${ctx.session.user.stylingLibrary}}} based on a user's input description. Your goal is to create a functional, well-structured component that meets the user's requirements.\n\nHere's the user's input describing the desired component:\n<user_input>\n{{${userInput}}}\n</user_input>\n\nFollow these steps to generate the React component:\n\n1. Analyze the user's input carefully to understand the requirements.\n2. Determine the necessary props, state, and functionality for the component.\n3. Structure the component using modern React practices (functional components and hooks).\n4. Implement the described functionality, including any event handlers or side effects.\n5. Add appropriate comments to explain complex logic or important parts of the code.\n\nAdhere to these coding style guidelines:\n- Use ES6+ syntax\n- Follow proper indentation and formatting\n- Use meaningful variable and function names\n- Implement error handling where appropriate\n- Ensure the component is reusable and modular\n- All props should be defined in a interface\n\n\nOnce you have generated the component, present your code inside <react_component> tags. This <react_component> tag and its contents should be the only thing that is written in your response. There should be no supplementary text, describing the component or its functionality, your job is to only provide the code in the <react_component> tag. The code that your write should be executable.\n\nIf you need any clarification or additional information about the user's requirements, state so before generating the component. If you need clarification wrap your clarification in <question> tag. Otherwise, proceed with creating the React component based on the given input.\n`,
              },
            ],
          },
        ],
      });

      const parsedResponse = ClaudeContentsSchema.safeParse(response.content);
      if (!parsedResponse.success) return "Nothing";

      return parsedResponse.data[0];
    }),
});
