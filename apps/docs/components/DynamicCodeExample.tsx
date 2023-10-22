import { useEffect, useRef, useState } from "react";
import { Select } from "@radix-ui/themes";
import { models, providers } from "llm-repo";
import { providerToLogoMapping } from "llm-repo/logos";
import type { Model, ModelDefinition } from "llm-repo";
import Image from "next/image";

export const getSelectContent = (allowedProvider?) => {
  const sections: { [key: string]: { key: string, logo: any, models: { value: string, name: string }[] } } = {};

  Object.entries(models).forEach((entry) => {
    const modelValue: Model = entry[0];
    const modelDefinition: ModelDefinition = entry[1];

    const provider = modelDefinition.provider as string;

    if (!sections[provider]) {
      const logo = providerToLogoMapping[modelDefinition.provider]
      sections[provider] = {
        key: provider,
        logo,
        models: []
      }
    }

    sections[provider].models.push({
      value: modelValue,
      name: modelDefinition.name
    });
  });

  const entries = Object.entries(sections);

  return entries
  .filter(([providerKey]) => allowedProvider ? providerKey === allowedProvider : true)
  .map(([providerKey, section], index) => {
    const { logo, models } = section;
    const { name: providerName } = providers[providerKey];

    return (
      <>
        <Select.Group key={providerKey}>

          <Select.Label>
        
            {providerName}
             </Select.Label>
          
          {models.map(({ name, value }) => (
           <Select.Item value={value}>
            <div className="flex items-center justify-center">

            <Image className="mr-2 rounded-sm" src={logo} width={20} height={20} alt={providerName} />
            {name}
            </div>
           </Select.Item>
    ))}
        </Select.Group>
        {!allowedProvider && index < entries.length - 1 && <Select.Separator />}
      </>
    )
  });
}

type Props = {
  children: React.ReactNode;
  defaultLLM: string;
  allowedProvider?: string;
}

export function DynamicCodeExample({ children, defaultLLM, allowedProvider }: Props) {
  const ref = useRef<any>();
  const setupRef = useRef<any>();
  const modelRef = useRef<any>();
  const [selectedLLM, setSelectedLLM] = useState(defaultLLM ?? "openai/gpt-3.5-turbo");

  // Find the corresponding token from the DOM
  useEffect(() => {
    if (ref.current) {
      const code = [...ref.current.querySelectorAll("code span")];

      const model = code.find(
        (el) => el.innerText === `"#MODEL#"`,
      );
      modelRef.current = model;

      const setup = code.find(
        (el) => el.innerText === "  #SETUP#",
      );
      setupRef.current = setup;
    }
  }, []);

  useEffect(() => {
    if (setupRef.current && modelRef.current) {
      const model = models[selectedLLM];

      modelRef.current.innerText = `"${selectedLLM}"`;
      setupRef.current.innerText = model.setup;
      setupRef.current.style.color = "var(--shiki-token-comment)";
    }
  }, [selectedLLM]);

  const handleSelectChange = (value: string) => {
    if (modelRef.current) {
      modelRef.current.innerText = `"${value}"`;
    }

    setSelectedLLM(value);
  }

  return (
    <>
      <div className="dynamic-code-example mt-4 bg-stone-900 rounded-md border border-stone-700">
        <div className="py-2 px-2 flex items-center">
          <div className="flex-1 px-2 font-semibold"></div>
          <div className="border-red-500">
            <Select.Root defaultValue={selectedLLM} onValueChange={handleSelectChange}>
              <Select.Trigger />
              <Select.Content>
                {getSelectContent(allowedProvider)}
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        <div ref={ref} className="code-container">
          {children}
        </div>
      </div>
    </>
  );
}
