"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCard, Github, Command, LogOut, User } from "lucide-react";
import { urlType } from "@/types/url-type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignedOut, SignedIn, useClerk, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CmdBox } from "./cmd";

export function Header() {
  const [isOpen, openSetter] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [url, setUrl] = useState<urlType>({
    path: "",
    linkText: "",
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && validateURL();

    return () => {
      setCount(0);
    };
  }, [count, pathname]);

  const validateURL = async () => {
    if (!pathname.includes("request") && pathname.includes("store")) {
      return setUrl({ ...url, path: "store/request", linkText: "Request" });
    }
    return setUrl({ ...url, path: "store", linkText: "Store" });
  };

  return (
    <>
      <header className="fixed z-10 top-0 left-0 w-full bg-[#09090b]/50 border-b border-zinc-900 backdrop-blur-md flex items-center justify-between p-2 md:px-32 lg:px-32">
        <div id="left" className="md:flex lg:flex items-center gap-5">
          <div id="logo">
            <Link href={"/"}>
              <Image
                src="/icon-transparent.png"
                alt="Magic logo"
                width={60}
                height={60}
                onClick={() => router.refresh()}
              />
            </Link>
          </div>
          <div id="links" className="md:flex lg:flex hidden items-center gap-3">
            {/* <Link
              href="/pricing"
              className="font-medium text-neutral-300 hover:text-white"
            >
              Pricing
            </Link> */}
            <Link
              href="/changelog"
              className="font-medium text-neutral-300 hover:text-white"
            >
              Changelog
            </Link>
            <Link
              href={`/${url.path}`}
              className="font-medium text-neutral-300 hover:text-white"
            >
              {url.linkText}
            </Link>
          </div>
        </div>
        <div id="right" className="flex flex-row-reverse items-center gap-3">
          <div id="links" className="flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in" className="text-white">
                <Button className="bg-transparent border border-neutral-600 hover:bg-zinc-900 hover:border-neutral-800">
                  Login
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={`@${user?.firstName}`}
                    />
                    <AvatarFallback>
                      {user?.firstName?.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-zinc-900 border border-zinc-800 shadow-lg">
                  <DropdownMenuLabel className="">
                    <p className="font-medium">{user?.firstName}</p>
                    <p className="font-normal text-xs text-neutral-400">
                      {user?.emailAddresses[0].emailAddress}
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="w-auto bg-zinc-800 h-px" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="focus:bg-zinc-800">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="w-auto bg-zinc-800 h-px" />
                    <DropdownMenuItem
                      className="focus:bg-red-800 focus:text-red-200"
                      onClick={() => signOut(() => router.push("/"))}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>
          </div>
          <div id="cmd" className="md:hidden lg:hidden block">
            <Command onClick={() => openSetter(true)} />
          </div>
        </div>
      </header>
      <CmdBox isOpen={isOpen} openSetter={openSetter} url={url} />
    </>
  );
}
