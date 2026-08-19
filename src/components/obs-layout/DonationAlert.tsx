import { getAlertGifFromDonationAmount } from "../../utils/widgets/donationAlertGifs";
import { getAlertChessterIconFromDonationAmount } from "../../utils/widgets/donationAlertAssets";

export type DonationAlertProps = {
  name?: string | null;
  amount?: number | null;
  comment?: string | null;
  withBgBlur?: boolean;
  language: "de" | "en";
};

const getDonationCommentFontSize = (comment: string | null | undefined) => {
  if (!comment) return 20;
  if (comment.length < 40) return 20;
  if (comment.length < 80) return 19;
  if (comment.length < 120) return 17;
  return 15;
};

export const DonationAlert = ({
  name,
  amount,
  comment,
  language,
}: DonationAlertProps) => {
  const gifSrc = getAlertGifFromDonationAmount(amount);
  const chessterIcon = getAlertChessterIconFromDonationAmount(amount);
  const commentFontSize = getDonationCommentFontSize(comment);

  return (
    <>
      <img
        className="mx-auto -mb-6 size-96 object-contain object-top"
        src={gifSrc}
        alt=""
      />
      <div className="h-[258px] w-[606px]">
        <div className="flex size-full gap-4 p-4">
          <img
            className="mb-4 object-contain"
            src={chessterIcon}
            alt=""
            width={117}
            height={108}
          />
          <div className="flex">
            <div className="my-auto flex flex-col gap-2">
              <div className="text-[1.375rem]">
                <span className="break-all">
                  {name || (language === "en" ? "Anonymous" : "Anonym")}
                </span>{" "}
                {language === "en" ? "donates" : "spendet"}{" "}
                {amount != null && amount / 100}
              </div>
              {comment && (
                <div
                  className="max-w-[420px] pb-3 leading-normal"
                  style={{ fontSize: `${commentFontSize}px` }}
                >
                  &quot;
                  {comment.length > 170
                    ? `${comment?.slice(0, 167)}...`
                    : comment}
                  &quot;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
