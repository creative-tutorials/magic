import { typeApps } from "@/types/apps";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Cards(props: { data: typeApps[] }) {
  return (
    <div
      id="cards"
      className="md:grid md:grid-cols-3 lg:grid lg:grid-cols-3 gap-2 flex flex-col"
    >
      {props.data.map((item: typeApps, index: number) => (
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
  );
}
