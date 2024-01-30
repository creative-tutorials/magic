import { debounce } from "lodash";
import { Dispatch, SetStateAction, useCallback } from "react";
import { updateFilter } from "@/functions/actions";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiURL } from "@/types/url-type";

type typeCategory = {
  gID: string;
  name: string;
};

type DropdwnFilterProp = {
  url: apiURL;
  setIsFetching: Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<never[]>>;
  catData: {
    categories: typeCategory[];
    isLoading: boolean;
  };
};

export function DropdownFilter(props: DropdwnFilterProp) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const debouncedFilter = debounce((term) => {
    console.info("Performing filter:", term);
    return updateFilter(term, props.url, props.setIsFetching, props.setData);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 border border-zinc-800 hover:bg-zinc-900"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-zinc-950 border border-zinc-800">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {props.catData.isLoading && <p>Please wait</p>}
        <DropdownMenuRadioGroup
          value={category as string}
          onValueChange={(value) => {
            router.push(pathname + "?" + createQueryString("category", value), {
              scroll: false,
            });
            debouncedFilter(value);
          }}
        >
          {props.catData.categories.length > 0 && (
            <>
              {props.catData.categories.map(
                (item: typeCategory, index: number) => (
                  <DropdownMenuRadioItem value={item.name} key={index}>
                    {item.name}
                  </DropdownMenuRadioItem>
                )
              )}
            </>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
