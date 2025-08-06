import cn from "classnames";
import { ChangeEventHandler, useEffect, useState } from "react";
import { PageContainer } from "../components/PageContainer";
import { useSearchParams } from "react-router";

import { DownloadWrapper } from "../components/DownloadWrapper";
import {
  IntroductionsLayout,
  IntroductionsLayoutProps,
} from "../components/IntroductionsLayout";
import {
  availableSocials,
  SocialPlatform,
  SocialsOption,
} from "../utils/socials";

export const IntroductionImages = () => {
  const [searchParams] = useSearchParams();
  const [downloadActive, setDownloadActive] = useState(false);
  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [description, setDescription] = useState("");
  const [socialLinks, setSocialLinks] = useState<Array<SocialsOption>>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    setName(searchParams.get("name") || "");
    setPronouns(searchParams.get("pronouns") || "");
    setDescription(searchParams.get("description") || "");
    const newSocialLinks: Array<SocialsOption> = [];
    availableSocials.forEach((social) => {
      const socialValue = searchParams.get(social);
      if (socialValue)
        newSocialLinks.push({ platform: social, link: socialValue });
    });
    setSocialLinks(newSocialLinks);
  }, [searchParams]);

  const toggleDownloadActive = () => {
    setDownloadActive((prev) => !prev);
  };

  const handleProfilePictureUpdate: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setDownloadActive(false);
    const file = event.target.files?.[0];
    if (!file) return;
    setProfilePicture(URL.createObjectURL(file));
  };

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setDownloadActive(false);
    setName(event.target.value);
  };

  const handlePronounsChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setDownloadActive(false);
    setPronouns(event.target.value);
  };

  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setDownloadActive(false);
    setDescription(event.target.value);
  };

  const handleSocialChange = (value: string, platform: SocialPlatform) => {
    setDownloadActive(false);
    setSocialLinks((prev) => {
      const newArray = [...prev];
      const entry = newArray.find(
        (previousSocial) => previousSocial.platform === platform
      );
      if (entry) entry.link = value;
      else newArray.push({ platform, link: value });

      return newArray.filter((option) => !!option.link);
    });
  };

  const handleCopyPress = () => {
    const paramsArray: string[][] = [];
    if (name) paramsArray.push(["name", name]);
    if (pronouns) paramsArray.push(["pronouns", pronouns]);
    if (description) paramsArray.push(["description", description]);
    paramsArray.push(
      ...socialLinks.map((socialLinkEntry) => [
        socialLinkEntry.platform,
        socialLinkEntry.link,
      ])
    );

    const searchParams = new URLSearchParams(paramsArray);
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}${paramsArray.length > 0 ? "?" + searchParams : ""}`
    );
    setCopied(true);
  };

  const thumbnailLayoutProps: IntroductionsLayoutProps = {
    name,
    pronouns,
    profilePicture,
    description,
    socials: socialLinks,
  };

  return (
    <PageContainer className="grid grid-cols-[1fr_minmax(0,1080px)] gap-4">
      <div className="flex h-fit flex-col gap-1 rounded bg-neutral-700 p-4 text-white">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 2xl:grid-cols-2">
          <label className="flex w-full cursor-pointer flex-col">
            <span>Name</span>
            <input
              type="text"
              className="text-lg text-black"
              name="name"
              value={name}
              onChange={handleNameChange}
            />
          </label>
          <label className="flex w-full cursor-pointer flex-col">
            <span>Pronouns</span>
            <input
              className="text-lg text-black"
              type="text"
              name="pronouns"
              value={pronouns}
              onChange={handlePronounsChange}
            />
          </label>
        </div>
        <label className="flex cursor-pointer flex-col">
          <span>Profile Picture</span>
          <input
            type="file"
            accept="image/png, image/jpeg"
            name="profilePicture"
            className="cursor-pointer"
            onChange={handleProfilePictureUpdate}
          />
        </label>
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 2xl:grid-cols-2">
          {availableSocials.map((social) => (
            <label key={social} className="flex w-full cursor-pointer flex-col">
              <span>{social}</span>
              <input
                type="text"
                className="text-lg text-black"
                name={social}
                value={
                  socialLinks.find((option) => option.platform === social)
                    ?.link || ""
                }
                onChange={(event) =>
                  handleSocialChange(event.target.value, social)
                }
              />
            </label>
          ))}
        </div>
        <div className="mb-4 flex items-end gap-1.5">
          <label className="flex w-full cursor-pointer flex-col">
            <span>Beschreibung</span>
            <textarea
              className="text-lg text-black"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              rows={14}
            />
          </label>
        </div>
        <div className="relative flex justify-between">
          <div>
            <button
              type="button"
              className="mt-4 w-fit rounded border px-2 py-0.5"
              onClick={handleCopyPress}
            >
              Link kopieren
            </button>
            <div
              className={cn(
                "absolute -top-3 ml-1 text-neutral-50 transition-[opacity,transform] duration-300",
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

          <button
            type="button"
            className="mt-4 w-fit rounded border px-2 py-0.5"
            onClick={toggleDownloadActive}
          >
            {downloadActive ? "Bild Bearbeiten" : "Bild Rendern"}
          </button>
        </div>
      </div>
      <div className="overflow-scroll">
        {downloadActive ? (
          <DownloadWrapper
            className="aspect-square w-[1080px]"
            fileBaseName={`selbstvorstellung${name ? "_" + name.toLowerCase().replace(" ", "_") : ""}`}
            downloadPosition="top-left"
          >
            {({ onLoad }) => (
              <IntroductionsLayout onLoad={onLoad} {...thumbnailLayoutProps} />
            )}
          </DownloadWrapper>
        ) : (
          <IntroductionsLayout {...thumbnailLayoutProps} />
        )}
      </div>
    </PageContainer>
  );
};
