import * as React from "react";
import { useState } from "react";
import { default as axios } from "axios";
import MarkdownView from "react-showdown";
import { MdDirections } from "react-icons/md";
import "mapbox-gl/dist/mapbox-gl.css";
import FAQCard from "./FAQCard";
import { BiSolidMagicWand } from "react-icons/bi";
import {
  Map,
  Marker,
  Coordinate as CoordinateType,
} from "@yext/sites-components";
import { Map as MapType } from "@yext/components-tsx-maps";
const CustomChat = () => {
  const [inputText, setInputText] = useState("");
  const [botResponse, setBotResponse] = useState<any>();
  const [searchStart, setSearchStart] = useState(false);
  const [loading, setLoading] = useState(false);

  const runSearch = () => {
    setLoading(true);
    setSearchStart(true);
    let data = JSON.stringify({
      messages: [
        {
          timestamp: "1683559587573",
          source: "USER",
          text: inputText,
        },
      ],
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://liveapi.yext.com/v2/accounts/me/chat/vodafone-italy/message?v=20230101",
      headers: {
        "api-key": "1066fedb238935bc1d4724ad12c19d72",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));

        setBotResponse(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      runSearch();
    }
  };
  const handleInputChange = (e: any) => {
    setInputText(e.target.value);
    !e.target.value && (setSearchStart(false), setBotResponse(""));
  };

  return (
    <>
      <div>
        <div className="h-12 -mb-2 flex-1">
          <div className="relative bg-white border rounded-3xl border-gray-200 w-full overflow-hidden">
            <div className="inline-flex items-center justify-between w-full">
              <input
                className="outline-none flex-grow p-4 border-none ml-4 h-full pl-0.5 pr-2 text-neutral-dark text-base placeholder:text-neutral-light"
                value={inputText}
                id="searchInput"
                aria-label="Conduct a search"
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
              />
              <div className="w-8 h-full mx-2 flex flex-col justify-center items-center">
                <button
                  className="h-7 w-7"
                  aria-label="Submit Search"
                  onClick={runSearch}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {!loading && botResponse ? (
          <>
            <div className="border p-4 flex flex-col gap-4">
              <div className="font-bold text-left flex items-center gap-2 text-blue-900">
                <BiSolidMagicWand className="h-5 w-5" /> AI Generated
              </div>
              <MarkdownView
                markdown={botResponse.response.message.text}
                className="text-left w-full prose-sm text-blue-900 list-disc"
              />
            </div>
            {console.log(
              JSON.stringify(botResponse.response.notes.queryResult)
            )}

            {botResponse.response.notes.queryResult.modules.map(
              (module, index) => {
                switch (module.verticalConfigId) {
                  case "help_articles": {
                    return (
                      <div className="px-4  gap-x-4 gap-y-6 prose-sm">
                        <div className="font-semibold text-left">
                          Help articles{" "}
                        </div>
                        {module.results.map((result, rindex) => {
                          return (
                            <div
                              key={`result-${index}-${rindex}`}
                              className="rounded-lg overflow-hidden"
                            >
                              <FAQCard {...result}></FAQCard>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  case "locations": {
                    return (
                      <div className="flex flex-col">
                        <div className="font-semibold text-left mb-4">
                          Locations
                        </div>
                        <div className="flex flex-row gap-x-10">
                          <div className="grid grid-cols-3 gap-6 divide-y divide-gray-200 w-full max-h-[66vh] overflow-scroll">
                            {module.results.map((result, rindex) => {
                              return (
                                <div className="flex flex-row border p-4">
                                  <div
                                    key={`map-res-${rindex}`}
                                    className="py-6 flex flex-col gap-y-2 w-full"
                                  >
                                    <a
                                      target="_blank"
                                      className="text-slate-800 font-medium hover:underline"
                                      href={result.data.c_deployedURL ?? "/"}
                                    >
                                      {result.data.name}
                                    </a>
                                    <div className="text-sm text-slate-800">
                                      {result.data.address.line1}
                                    </div>
                                    <div className="text-sm text-slate-800">
                                      {result.data.address.city},{" "}
                                      {result.data.address.region}{" "}
                                      {result.data.address.postalCode}
                                    </div>
                                  </div>
                                  <a
                                    target="_blank"
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${result.data.yextDisplayCoordinate.latitude},${result.data.yextDisplayCoordinate.longitude}`}
                                    className="my-auto mx-auto flex flex-col gap-y-2"
                                  >
                                    <div className="mx-auto rounded-full p-1 border border-blue-800/50">
                                      <MdDirections className="h-7 w-7 text-blue-900" />
                                    </div>
                                    <div className="text-sm text-blue-900">
                                      Directions
                                    </div>
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                          <Map
                            mapLib={import("mapbox-gl")}
                            mapboxAccessToken="pk.eyJ1IjoibWRhdmlzaCIsImEiOiJja3pkNzZ4cDYydmF6MnZtemZrNXJxYmtvIn0.9CYfaiw9PB90VlQEqt3dRQ"
                            initialViewState={{
                              longitude: -100,
                              latitude: 40,
                              zoom: 3.5,
                            }}
                            style={{
                              color: "blue",
                              width: "45vw",
                              height: "66vh",
                              flexShrink: 0,
                            }}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                          >
                            {module.results.map((result) => {
                              console.log(JSON.stringify(result));

                              return (
                                <Marker
                                  latitude={
                                    result.data.yextDisplayCoordinate.latitude
                                  }
                                  longitude={
                                    result.data.yextDisplayCoordinate.longitude
                                  }
                                />
                              );
                            })}
                          </Map>
                        </div>
                      </div>
                    );
                  }
                }
              }
            )}
          </>
        ) : (
          <>
            {searchStart && (
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            )}
          </>
        )}
      </>
    </>
  );
};

export default CustomChat;
