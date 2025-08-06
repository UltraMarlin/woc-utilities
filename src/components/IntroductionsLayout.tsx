import { useEffect } from "react";
import { DownloadableComponentProps } from "./DownloadWrapper";
import backgroundImage from "../assets/images/night-background.png";
import { SocialsOption } from "../utils/socials";

export type IntroductionsLayoutProps = DownloadableComponentProps & {
  name?: string;
  pronouns?: string;
  profilePicture?: string;
  socials?: SocialsOption[];
  description?: string;
};

export const IntroductionsLayout = ({
  onLoad,
  hotReload = false,
  name,
  pronouns,
  profilePicture,
  socials,
  description,
}: IntroductionsLayoutProps) => {
  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  if (hotReload) {
    onLoad?.();
  }

  return (
    <div className="relative aspect-square w-[1080px] bg-green-300 text-5xl">
      <img
        src={backgroundImage}
        alt=""
        className="absolute size-full object-cover"
      />
      <div className="absolute inset-4 flex flex-col gap-2 text-white">
        <span>{name}</span>
        <span>{pronouns}</span>
        {profilePicture && <img src={profilePicture} alt="" />}
        {socials?.map((social) => (
          <div key={social.platform}>
            <span>{social.platform}: </span>
            <span>{social.link}</span>
          </div>
        ))}
        <p className="whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};
