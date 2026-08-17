import cn from "classnames";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { RangeSlider } from "../components/RangeSlider";
import { lowerSanitize } from "../utils/formatting/sanitize";

export const MIN_DESCRIPTION_LINEHEIGHT = 1.1;
export const MAX_DESCRIPTION_LINEHEIGHT = 1.35;
export const MIN_DESCRIPTION_FONTSIZE = 32;
export const MAX_DESCRIPTION_FONTSIZE = 100;

export const IntroductionImages = () => {
  const [searchParams] = useSearchParams();
  const lastMousePosition = useRef<{
    x: number;
    y: number;
  } | null>(null);

  const [downloadActive, setDownloadActive] = useState(false);
  const [name, setName] = useState(() => searchParams.get("name") || "");
  const [pronouns, setPronouns] = useState(
    () => searchParams.get("pronouns") || ""
  );
  const [profilePicture, setProfilePicture] = useState("");
  const [picturePositionX, setPicturePositionX] = useState(
    () => parseInt(searchParams.get("x") || "") || 50
  );
  const [picturePositionY, setPicturePositionY] = useState(
    () => parseInt(searchParams.get("y") || "") || 50
  );
  const [description, setDescription] = useState(
    () => searchParams.get("description") || ""
  );
  const [descriptionFontSize, setDescriptionFontSize] = useState(
    () => parseInt(searchParams.get("descriptionFontSize") || "") || 64
  );
  const [socialLinks, setSocialLinks] = useState<Array<SocialsOption>>(() => {
    const newSocialLinks: Array<SocialsOption> = [];
    availableSocials.forEach((social) => {
      const socialValue = searchParams.get(social);
      if (socialValue)
        newSocialLinks.push({ platform: social, link: socialValue });
    });
    return newSocialLinks;
  });
  const [copied, setCopied] = useState(false);
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

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
    setPicturePositionX(50);
    setPicturePositionY(50);
  };

  const handlePicturePositionXChange = (value: number) => {
    setDownloadActive(false);
    setPicturePositionX(value);
  };

  const handlePicturePositionYChange = (value: number) => {
    setDownloadActive(false);
    setPicturePositionY(value);
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

  const handleDescriptionFontSizeChange = (value: number) => {
    setDownloadActive(false);
    setDescriptionFontSize(value);
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
    if (picturePositionX && picturePositionX !== 50)
      paramsArray.push(["x", `${picturePositionX}`]);
    if (picturePositionY && picturePositionX !== 50)
      paramsArray.push(["y", `${picturePositionY}`]);
    if (descriptionFontSize && descriptionFontSize !== 64)
      paramsArray.push(["descriptionFontSize", `${descriptionFontSize}`]);
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

  const handleMouseEnter = () => {
    const element = scrollContainer.current;
    if (!element) return;
    const isScrollable =
      element.scrollWidth > element.clientWidth ||
      element.scrollHeight > element.clientHeight;
    if (isScrollable) element.style.cursor = "all-scroll";
    else element.style.cursor = "default";
  };

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!scrollContainer.current) return;
    lastMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!lastMousePosition.current || !scrollContainer.current) return;
    const differenceX = event.clientX - lastMousePosition.current.x;
    const differenceY = event.clientY - lastMousePosition.current.y;
    scrollContainer.current.scrollBy({
      left: -differenceX * 1.5,
      top: -differenceY * 1.5,
    });
    lastMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const resetMousePosition: MouseEventHandler<HTMLDivElement> = () => {
    if (!scrollContainer.current) return;
    lastMousePosition.current = null;
  };

  const thumbnailLayoutProps: IntroductionsLayoutProps = {
    name,
    pronouns,
    profilePicture,
    picturePositionX,
    picturePositionY,
    description,
    descriptionFontSize,
    socials: socialLinks,
  };

  return (
    <PageContainer className="grid grid-cols-[1fr_minmax(0,792px)] gap-4">
      <div className="flex h-fit flex-col gap-1 rounded bg-neutral-700 p-4 text-white">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 xl:grid-cols-2">
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
        <div className="flex flex-col items-start gap-4 py-4">
          <label className="flex cursor-pointer flex-col">
            <span>Profile Picture</span>
            <input
              type="file"
              accept="image/png, image/jpeg"
              name="profilePicture"
              className="min-w-48 cursor-pointer"
              onChange={handleProfilePictureUpdate}
            />
          </label>
          <div className="flex w-full flex-col gap-x-4 gap-y-1 xl:flex-row xl:gap-y-2">
            <RangeSlider
              className="w-full"
              onChange={handlePicturePositionXChange}
              value={picturePositionX}
            >
              Picture X in %
            </RangeSlider>
            <RangeSlider
              className="w-full"
              onChange={handlePicturePositionYChange}
              value={picturePositionY}
            >
              Picture Y in %
            </RangeSlider>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 xl:grid-cols-2">
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
            <span>Description</span>
            <textarea
              className="text-lg text-black"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              rows={8}
            />
          </label>
        </div>
        <RangeSlider
          className="w-full"
          onChange={handleDescriptionFontSizeChange}
          value={descriptionFontSize}
          min={MIN_DESCRIPTION_FONTSIZE}
          max={MAX_DESCRIPTION_FONTSIZE}
        >
          Description Font Size
        </RangeSlider>
        <div className="relative flex justify-between">
          <div>
            <button
              type="button"
              className="mt-4 w-fit rounded border px-2 py-0.5"
              onClick={handleCopyPress}
            >
              Copy Link
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
            {downloadActive ? "Edit Image" : "Render Image"}
          </button>
        </div>
      </div>
      <div
        className={cn({
          "sticky top-4 max-h-[min(100vh-100px,792px)] overflow-scroll":
            !downloadActive,
        })}
        ref={scrollContainer}
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseUp={resetMousePosition}
        onMouseLeave={resetMousePosition}
        onMouseMove={handleMouseMove}
      >
        {downloadActive ? (
          <DownloadWrapper
            className="aspect-square w-[800px]"
            fileBaseName={`selbstvorstellung${name ? "_" + lowerSanitize(name) : ""}`}
            downloadPosition="top-left"
          >
            {({ onLoad }) => (
              <IntroductionsLayout onLoad={onLoad} {...thumbnailLayoutProps} />
            )}
          </DownloadWrapper>
        ) : (
          <IntroductionsLayout
            className="-mb-[792px] -mr-[792px] origin-top-left scale-50"
            scale={0.5}
            {...thumbnailLayoutProps}
          />
        )}
      </div>
    </PageContainer>
  );
};
