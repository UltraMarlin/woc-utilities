import { useEffect, useRef, useState } from "react";
import cn from "classnames";

import type { Donation } from "../../../hooks/useDonations";
import { LayoutDonationName } from "./LayoutDonationName";
import { SmashText } from "../../SmashText";
import { formatEuro } from "../../../utils/formatting/formatMoney";

import heartIcon from "../../../assets/layout/heart-icon.png";

export type LayoutDonationListProps = {
  headline: string;
  donations: Donation[] | undefined;
  language: "de" | "en";
  className?: string;
  listClassName?: string;
};

export const LayoutDonationList = ({
  headline,
  donations = [],
  language,
  className,
  listClassName,
}: LayoutDonationListProps) => {
  const [newDonationIds, setNewDonationIds] = useState<number[]>([]);
  const [newAnimationRunning, setNewAnimationRunning] = useState(false);
  const previousDonationIds = useRef<number[]>([]);

  useEffect(() => {
    const updatedDonationIds = donations.map((donation) => donation.id);
    const newDonationIds = updatedDonationIds.filter(
      (id) => !previousDonationIds.current.includes(id)
    );
    if (newDonationIds.length > 0) {
      setNewDonationIds(newDonationIds);
      setNewAnimationRunning(true);
    }
    previousDonationIds.current = donations.map((donation) => donation.id);
  }, [donations]);

  useEffect(() => {}, [newAnimationRunning, newDonationIds]);

  return (
    <div className={className}>
      <SmashText
        className="mb-1 mr-[14px] mt-2 text-right text-[32px]/none"
        shadowClassName="!top-[0.6px]"
        text={headline}
      />
      <ul
        className={cn(
          "flex flex-col pb-1.5 pl-3 pr-2 text-[23.6px]/tight font-bold",
          listClassName
        )}
      >
        {donations?.map((donation) => (
          <li key={donation.id} className="flex justify-between">
            <span className="flex">
              <img
                className="mr-1 shrink-0 object-contain"
                src={heartIcon}
                alt=""
                width={23}
                height={25}
              />
              <LayoutDonationName
                name={donation.donator_name}
                animate={newDonationIds.includes(donation.id)}
                language={language}
              />
            </span>
            {formatEuro(donation.donated_amount_in_cents)}
          </li>
        ))}
      </ul>
    </div>
  );
};
