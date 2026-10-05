import { ReactNode, useEffect, useState } from "react";
import cn from "classnames";
import { PageContainer } from "../components/PageContainer";
import { usePersistentState } from "../utils/usePersistentState";

type QueryParam = [key: string, value: string | boolean];

const buildUrl = (path: string, params: QueryParam[]) => {
  const query = params
    .filter(([, value]) => value !== false)
    .map(([key, value]) =>
      value === true ? key : `${key}=${encodeURIComponent(value)}`
    )
    .join("&");
  return `${window.location.origin}${path}?${query}`;
};

const INTERMISSION_TYPES = [
  { type: "start", label: "Start" },
  { type: "pause", label: "Pause" },
  { type: "fin", label: "End" },
];

type RadioGroupProps = {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

const RadioGroup = ({
  label,
  name,
  value,
  options,
  onChange,
}: RadioGroupProps) => (
  <fieldset className="flex flex-col">
    <legend>{label}</legend>
    <div className="flex gap-4">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-1.5"
        >
          <input
            type="radio"
            className="cursor-pointer"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </fieldset>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="flex flex-col gap-3 rounded bg-neutral-700 px-3 py-2 text-sm text-white">
    <h2 className="text-lg font-semibold">{title}</h2>
    {children}
  </section>
);

const LinkField = ({ label, url }: { label?: string; url: string }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopyPress = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <div className="flex flex-col">
      {label && <span>{label}</span>}
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          className="min-w-0 flex-1 text-base text-black"
          value={url}
          onFocus={(event) => event.currentTarget.select()}
        />
        <div className="relative">
          <button
            type="button"
            className="w-fit rounded border px-2 py-0.5"
            onClick={handleCopyPress}
          >
            Copy
          </button>
          <div
            className={cn(
              "absolute bottom-full right-0 whitespace-nowrap text-neutral-50 transition-[opacity,transform] duration-300",
              {
                "translate-y-0 opacity-100": copied,
                "translate-y-1 opacity-0": !copied,
              }
            )}
            aria-hidden={!copied}
            inert={!copied}
          >
            Copied to clipboard!
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="w-fit rounded border px-2 py-0.5"
        >
          Open
        </a>
      </div>
    </div>
  );
};

export const WidgetObsSetup = () => {
  const [theme, setTheme] = usePersistentState("obsSetup.theme", "light");
  const [language, setLanguage] = usePersistentState("obsSetup.language", "de");
  const [fullBackground, setFullBackground] = usePersistentState(
    "obsSetup.fullBackground",
    false
  );
  const [name, setName] = usePersistentState("obsSetup.name", "");
  const [pronouns, setPronouns] = usePersistentState("obsSetup.pronouns", "");
  const [noCam, setNoCam] = usePersistentState("obsSetup.noCam", false);

  const backgroundUrl = buildUrl("/streaming/obs-background", [
    ["theme", theme],
    ["full", fullBackground],
  ]);
  const layoutUrl = buildUrl("/streaming/obs-overlay", [
    ["theme", theme],
    ["lang", language],
    ["name", name.trim() || "empty"],
    ["pronouns", pronouns.trim() || "empty"],
    ["nocam", noCam],
  ]);

  return (
    <PageContainer>
      <div className="flex max-w-[1000px] flex-col gap-4">
        <Section title="Global Settings">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <RadioGroup
              label="Theme"
              name="theme"
              value={theme}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              onChange={setTheme}
            />
            <RadioGroup
              label="Language"
              name="language"
              value={language}
              options={[
                { value: "de", label: "Deutsch" },
                { value: "en", label: "English" },
              ]}
              onChange={setLanguage}
            />
          </div>
        </Section>
        <Section title="Background">
          <label className="flex w-fit cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={fullBackground}
              onChange={(event) => setFullBackground(event.target.checked)}
            />
            <span>Full background (you probably dont need this!)</span>
          </label>
          <LinkField url={backgroundUrl} />
        </Section>
        <Section title="Layout">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <label className="flex min-w-48 max-w-[300px] flex-1 cursor-pointer flex-col">
              <span>Name</span>
              <input
                type="text"
                className="text-base text-black"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="flex min-w-48 max-w-[300px] flex-1 cursor-pointer flex-col">
              <span>Pronouns</span>
              <input
                type="text"
                className="text-base text-black"
                name="pronouns"
                value={pronouns}
                onChange={(event) => setPronouns(event.target.value)}
              />
            </label>
          </div>
          <RadioGroup
            label="Camera"
            name="camera"
            value={noCam ? "nocam" : "cam"}
            options={[
              { value: "cam", label: "With cam" },
              { value: "nocam", label: "No cam" },
            ]}
            onChange={(value) => setNoCam(value === "nocam")}
          />
          <LinkField url={layoutUrl} />
        </Section>
        <Section title="Intermission">
          {INTERMISSION_TYPES.map(({ type, label }) => (
            <LinkField
              key={type}
              label={label}
              url={buildUrl("/streaming/obs-intermission", [
                ["theme", theme],
                ["lang", language],
                ["type", type],
              ])}
            />
          ))}
        </Section>
      </div>
    </PageContainer>
  );
};
