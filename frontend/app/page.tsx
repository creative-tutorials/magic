import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useImgArr } from "@/hooks/use-img";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  const images = useImgArr();
  return (
    <main className="mt-32">
      <section className="flex items-center justify-center flex-col gap-10 md:p-32 lg:p-32">
        <hgroup className="text-center flex flex-col items-center justify-center gap-6">
          <h1 className="md:text-7xl lg:text-7xl text-5xl text-white font-bold text-center">
            The appstore for{" "}
            <span className="text-red-600 drop-shadow-[0_35px_35px_#E41717]">
              services
            </span>
          </h1>
          <p className="md:text-xl lg:text-xl text-base text-slate-400 md:p-0 lg:p-0 px-4">
            Find services that you already use and love on the internet with
            Magic
          </p>
        </hgroup>
        <div id="btn" className="flex items-center gap-3">
          <Link href="/store">
            <Button className="bg-red-600 hover:bg-red-700 p-6 px-10">
              Store
            </Button>
          </Link>
          <Link
            href="https://github.com/creative-tutorials/magic"
            target="_blank"
          >
            <Button className="bg-white hover:bg-gray-100 text-black p-6 px-10 flex items-center gap-1 font-semibold">
              <Github /> Github
            </Button>
          </Link>
        </div>
        <div id="image" className="w-full h-auto">
          <Carousel
            className="w-full h-auto "
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="w-full h-auto ">
              {images.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="">
                    <Card className="border-none">
                      <CardContent className="p-4">
                        <Image
                          src={item}
                          width={500}
                          height={500}
                          priority
                          className="w-full md:h-[600px] lg:h-[600px] h-[170px] md:object-cover lg:object-cover rounded-lg border-2 border-red-600 shadow shadow-red-600"
                          alt={item.split("/")[2].split(".")[0]}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    </main>
  );
}
