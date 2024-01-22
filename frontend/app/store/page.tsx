"use client";
import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type typeApps = {
  appname: string;
  description: string;
  url: string;
  appicon: string;
  creator: string;
  twitterUrl: string;
};

export default function Page() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && fetchApps();

    return () => {
      setCount(0);
    };
  }, [count]);

  async function fetchApps() {
    axios
      .get("http://localhost:8080/api/apps", {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_API_KEY,
        },
      })
      .then(async (data) => {
        console.log(data.data);
        setData(data.data);
      })
      .catch(async (err) => {
        console.error(err.response);
        setData([]);
      });
  }

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
              alt="Picture of the author"
            />
          </div>
          <hgroup className="text-center flex flex-col items-center justify-center gap-6">
            <h1 className="md:text-7xl lg:text-7xl text-5xl text-white font-bold text-center">
              Store
            </h1>
            <p className="md:text-xl lg:text-xl text-slate-400">
              Let magic be your guide to finding webapps that you already use.{" "}
              <br />
              Looking for a webapp shouldn&apos;t be that hard
            </p>
          </hgroup>
          <div id="input" className="w-full max-w-md">
            <Input
              type="text"
              placeholder="Search"
              className="w-full border border-zinc-800 bg-zinc-900 cursor-pointer p-6"
            />
          </div>
        </section>
        <section className="flex items-center justify-center flex-col gap-10 md:p-10 lg:p-10 p-4">
          <hgroup className="text-center flex flex-col items-center justify-center gap-6">
            <h3 className="md:text-5xl lg:text-5xl text-3xl text-white text-center">
              Explore
            </h3>
            <p className="md:text-base lg:text-base text-sm text-slate-400">
              Browse through our webstore to find the app that you need.
            </p>
          </hgroup>
        </section>
        <section className="flex flex-col gap-10 md:p-10 lg:p-10 p-4">
          <hgroup className="flex flex-col gap-2">
            <h3 className="md:text-xl lg:text-xl text-lg text-white">
              Applications
            </h3>
            <p className="md:text-base lg:text-base text-sm text-slate-400">
              Explore our list of webapps and discover the ones that fits your
              needs.
            </p>
          </hgroup>
          <div
            id="cards"
            className="md:grid md:grid-cols-3 lg:grid lg:grid-cols-3 gap-2 flex flex-col"
          >
            {data.map((item: typeApps, index: number) => (
              <>
                <Card className="w-full h-full flex flex-col bg-zinc-900 border border-zinc-800">
                  <CardHeader className="flex flex-col gap-3">
                    <div
                      id="CardImage"
                      className="w-full h-full rounded-lg overflow-hidden object-cover border-2 border-transparent transition-all hover:border-red-300"
                    >
                      <Link href={item.url} target="_blank">
                        <Image
                          src={item.appicon}
                          width={500}
                          height={500}
                          alt={item.appname}
                          className="w-full h-full rounded-lg  overflow-hidden object-cover transition-all hover:scale-110"
                        />
                      </Link>
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      <hgroup>
                        <p className="text-white md:font-bold lg:font-bold font-medium">
                          {item.appname}
                        </p>
                      </hgroup>
                      <Link href={item.url} target="_blank">
                        <Button className="bg-zinc-800 hover:bg-zinc-700">
                          Open
                        </Button>
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-neutral-400">
                      {item.description}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="flex justify-between mt-auto">
                    <p className="md:text-sm lg:text-sm text-xs text-slate-300">
                      Made by{" "}
                      <Link
                        href={item.twitterUrl}
                        target="_blank"
                        className="hover:underline"
                      >
                        {item.creator}
                      </Link>{" "}
                    </p>
                  </CardFooter>
                </Card>
              </>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
