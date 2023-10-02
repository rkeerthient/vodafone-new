import * as React from "react";
import { useState } from "react";
import MarkdownView from "react-showdown";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

const FAQCard = (props: any): JSX.Element => {
  const { data } = props;
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="w-full border-b border-gray-300 px-4 py-2 my-2 ">
      <div className=" font-light">
        <div onClick={() => setIsActive(!isActive)}>
          <div className="   hover:cursor-pointer  ">
            <span className="font-medium">{data.name}</span>
            <div style={{ float: "right" }}>
              {isActive ? (
                <ChevronUpIcon className="w-7 text-[#083b3a]" />
              ) : (
                <ChevronDownIcon className="w-7 text-[#083b3a]" />
              )}
            </div>
          </div>
        </div>
        {isActive && (
          <div className="mt-3">
            <MarkdownView markdown={data.bodyV2.markdown}></MarkdownView>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQCard;
