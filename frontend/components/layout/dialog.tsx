import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SetStateAction, useState } from "react";
import { debounce } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { filteredApps } from "@/types/apps";
import { searchApp } from "@/functions/actions";
import { apiURL } from "@/types/url-type";
export function DialogBx(props: { url: apiURL }) {
  const [filteredData, setFilteredData] = useState<filteredApps>({
    appicon: "",
    appname: "",
    description: "",
    url: "",
  });
  const [isFiltering, setIsFiltering] = useState(false);

  const updateSearch = (value: SetStateAction<string>): void => {
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

  const debouncedSearch = debounce((term) => {
    console.info("Performing search:", term);
    return searchApp(
      term,
      setIsFiltering,
      filteredData,
      setFilteredData,
      props.url
    );
  }, 500);
  return (
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
            {isFiltering && <p className="text-center">Gathering data...</p>}
            {Object.values(filteredData).every(
              (value: string) => value !== ""
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
                            {filteredData.description.slice(0, 100) + "..."}
                          </p>
                        </hgroup>
                      </div>
                    </div>
                  </Link>
                  <Separator className="my-7 w-full h-px border border-zinc-800" />
                </>
              )}

            {Object.values(filteredData).every(
              (value: string) => value === ""
            ) &&
              !isFiltering && <p className="text-center">No data found</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
