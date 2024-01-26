"use client";
import { useState, useEffect, SetStateAction } from "react";
import { useAPIURL } from "@/hooks/get-url";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { fetchApps } from "@/functions/actions";
import { Loader2Icon, Search } from "lucide-react";
import { Cards } from "@/components/layout/cards";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { filteredApps } from "@/types/apps";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState<filteredApps>({
    appicon: "",
    appname: "",
    description: "",
    url: "",
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const url = useAPIURL();

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && fetchApps(setIsFetching, setData, url);

    return () => {
      setCount(0);
    };
  }, [count, url]);

  const debouncedSearch = debounce((term) => {
    console.info("Performing search:", term);
    return filterApps(term);
  }, 500);

  const updateSearch = (value: SetStateAction<string>) => {
    if (!value) {
      setFilteredData({
        appicon: "",
        appname: "",
        description: "",
        url: "",
      });
      return;
    }
    // wait for user to stop typing
    debouncedSearch(value);
  };

  const filterApps = (value: SetStateAction<string>) => {
    setIsFiltering(true);
    axios
      .get(`${url}/api/app/${value}`, {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_API_KEY,
        },
      })
      .then((data) => {
        setFilteredData({
          ...filteredData,
          appicon: data.data.appicon,
          appname: data.data.appname,
          description: data.data.description,
          url: data.data.url,
        });
        setIsFiltering(false);
      })
      .catch((err) => {
        console.error(err.response);
        setIsFiltering(false);
        setFilteredData({
          appicon: "",
          appname: "",
          description: "",
          url: "",
        });
      });
  };

  return (
    <>
      <main className="mt-32">
        <section className="flex items-center justify-center flex-col gap-10 md:p-10 lg:p-10 p-4">
          <div id="img" className="w-full h-full">
            <Image
              src="/Apps.png"
              width={500}
              height={500}
              priority
              unoptimized
              className="w-full h-full rounded-lg shadow-md shadow-purple-600"
              alt="Different apps"
            />
          </div>
          <hgroup className="text-center flex flex-col items-center justify-center gap-6">
            <h1 className="md:text-7xl lg:text-7xl text-5xl text-white font-bold text-center">
              Store
            </h1>
            <p className="md:text-xl lg:text-xl text-slate-400">
              Let magic be your guide to finding webapps & services that you
              already use. <br />
              Looking for things shouldn&apos;t be that hard
            </p>
          </hgroup>
          <div id="input" className="w-full max-w-md">
            <Dialog>
              <DialogTrigger asChild>
                <Input
                  type="text"
                  placeholder="Search"
                  className="w-full border border-zinc-800 bg-zinc-900 cursor-pointer p-6"
                  readOnly
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-zinc-950 border border-zinc-800">
                <DialogHeader>
                  <DialogTitle className="text-sm font-normal">
                    Search powered by{" "}
                    <Link
                      href="https://xata.io/"
                      target="_blank"
                      className="underline decoration-2 decoration-red-600"
                    >
                      Xata
                    </Link>
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4 flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="name" className="">
                      Project name
                    </Label>
                    <Input
                      id="name"
                      placeholder="uploadthing"
                      className="col-span-3 placeholder:text-neutral-400 px-4 p-6"
                      autoComplete="off"
                      onChange={(e) => updateSearch(e.target.value)}
                    />
                  </div>
                  <div id="data-wrapper" className="flex flex-col gap-8 mt-4">
                    {isFiltering && (
                      <p className="text-center">Gathering data...</p>
                    )}
                    {Object.values(filteredData).every(
                      (value) => value !== ""
                    ) &&
                      !isFiltering && (
                        <>
                          <Link href={filteredData.url} target="_blank">
                            <div
                              id="data"
                              className="w-full bg-neutral-950 border hover:border-dotted border-zinc-800 rounded-md p-4"
                            >
                              <div id="top" className="flex gap-3">
                                <div id="icon">
                                  <Image
                                    src={filteredData.appicon}
                                    width={80}
                                    height={80}
                                    alt={filteredData.appname}
                                    className="rounded-full w-12 h-12 object-cover max-w-none min-w-0"
                                  />
                                </div>
                                <hgroup className="flex flex-col gap-1">
                                  <p id="name">{filteredData.appname}</p>
                                  <p
                                    id="description"
                                    className="text-sm text-slate-400"
                                  >
                                    {filteredData.description}
                                  </p>
                                </hgroup>
                              </div>
                            </div>
                          </Link>
                          <Separator className="my-7 w-full h-px border border-zinc-800" />
                        </>
                      )}

                    {Object.values(filteredData).every(
                      (value) => value === ""
                    ) &&
                      !isFiltering && (
                        <p className="text-center">No data found</p>
                      )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>
        <section className="flex items-center justify-center flex-col gap-10 md:p-10 lg:p-10 p-4">
          <hgroup className="text-center flex flex-col items-center justify-center gap-6">
            <h3 className="md:text-5xl lg:text-5xl text-3xl text-white text-center">
              Explore
            </h3>
            <p className="md:text-base lg:text-base text-sm text-slate-400">
              Browse through our webstore to find what you need.
            </p>
          </hgroup>
        </section>
        <section className="flex flex-col gap-10 md:p-10 lg:p-10 p-4">
          <hgroup className="flex flex-col gap-2">
            <h3 className="md:text-xl lg:text-xl text-lg text-white">
              Applications
            </h3>
            <p className="md:text-base lg:text-base text-sm text-slate-400">
              Explore our list of different services and discover the ones that
              fits your needs.
            </p>
          </hgroup>
          {isFetching ? (
            <div className="flex items-center justify-center">
              <Loader2Icon className="w-24 h-24 animate-spin text-red-500 " />
            </div>
          ) : (
            <>
              <Cards data={data} />
            </>
          )}
        </section>
      </main>
    </>
  );
}
