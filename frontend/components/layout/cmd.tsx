import Link from "next/link";
import { Send, GitGraph, CreditCard, Package, Home, User } from "lucide-react";
import { CommandState } from "@/types/cmd";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CmdBox({ isOpen, openSetter, url }: CommandState) {
  return (
    <CommandDialog open={isOpen} onOpenChange={openSetter}>
      <CommandInput
        placeholder="Type a path"
        className="placeholder:text-gray-400"
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick links">
          <Link href="/">
            <CommandItem>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
          </Link>
          <Link href="/changelog">
            <CommandItem>
              <GitGraph className="mr-2 h-4 w-4" />
              <span>Changelog</span>
            </CommandItem>
          </Link>
          <Link href={`/${url.path}`}>
            <CommandItem>
              {url.linkText === "Request" ? (
                <Send className="mr-2 h-4 w-4" />
              ) : (
                <Package className="mr-2 h-4 w-4" />
              )}
              <span>{url.linkText}</span>
            </CommandItem>
          </Link>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <Link href="/profile">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </CommandItem>
          </Link>
          {/* <Link href="/billing">
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </CommandItem>
          </Link> */}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
