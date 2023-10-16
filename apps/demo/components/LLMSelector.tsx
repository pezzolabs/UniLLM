import { LLMs } from "@/utils/types";
import { Select } from "@radix-ui/themes";
import React from "react";

const llms: {
  name: string;
  value: string;
}[] = [
  {
    name: "OpenAI GPT-3.5 Turbo",
    value: LLMs["openai:gpt-3.5-turbo"],
  },
  {
    name: "OpenAI GPT-4",
    value: LLMs["openai:gpt-4"],
  },
  {
    name: "Anthropic Claude-2",
    value: LLMs["anthropic:claude-2"],
  },
  {
    name: "Azure OpenAI",
    value: LLMs["azure:gpt35turbo"],
  },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const LLMSelector = ({ onChange, value }: Props) => {
  return (
    <Select.Root value={value} onValueChange={(value) => onChange(value)}>
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          {llms.map((llm) => (
            <Select.Item key={llm.value} value={llm.value}>
              {llm.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};
