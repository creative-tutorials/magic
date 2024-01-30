"use client";
import Image from "next/image";
import { useAPIURL } from "@/hooks/get-url";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { fetchApps, updateFilter, fetchCategories } from "@/functions/actions";
import { Loader2Icon } from "lucide-react";
import { Cards } from "@/components/layout/cards";
import { DialogBx } from "@/components/layout/dialog";
import { DropdownFilter } from "@/components/layout/dropdown-filter";

export default function Page() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [catData, setCatData] = useState({
    categories: [],
    isLoading: false,
  });

  const [isFetching, setIsFetching] = useState(true);
  const url = useAPIURL();

  useEffect(() => {
    setCount((prev) => prev + 1);

    if (count === 1 && category === null) {
      fetchApps(setIsFetching, setData, url).then(() =>
        fetchCategories(setCatData, catData, url)
      );
    }

    if (count === 1 && category !== null) {
      fetchCategories(setCatData, catData, url).then(() =>
        updateFilter(category as string, url, setIsFetching, setData)
      );
    }

    return () => {
      setCount(0);
    };
  }, [count, url, category]);

  // ctrl K should open the search bar

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
            <DialogBx url={url} />
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
          <div
            id="section-pg-group"
            className="flex md:flex-row lg:flex-row flex-col md:gap-0 lg:gap-0 gap-3 md:items-center lg:items-center md:justify-between lg:justify-between"
          >
            <hgroup className="flex flex-col gap-2">
              <h3 className="md:text-xl lg:text-xl text-lg text-white">
                Applications
              </h3>
              <p className="md:text-base lg:text-base text-sm text-slate-400">
                Explore our list of different services and discover the ones
                that fits your needs.
              </p>
            </hgroup>
            <div id="categeory-select" className="flex items-end justify-end">
              <DropdownFilter
                url={url}
                setIsFetching={setIsFetching}
                setData={setData}
                catData={catData}
              />
            </div>
          </div>
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
