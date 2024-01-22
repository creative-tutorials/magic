"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SignedOut, useUser } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
export default function Page() {
  const { isSignedIn, user } = useUser();
  const [formData, setFormData] = useState({
    appname: "",
    description: "",
    url: "",
    isPending: false,
  });
  const createRequest = async () => {
    if (!isSignedIn) return;
    setFormData({ ...formData, isPending: true });
    console.log(user);
    axios
      .post(
        "http://localhost:8080/api/request",
        {
          appName: formData.appname,
          description: formData.description,
          url: formData.url,
          userName: user.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
            email: user.emailAddresses[0].emailAddress,
          },
        }
      )
      .then(async (res) => {
        console.log(res.data);
        const sucessMsg: string = res.data.data;
        setFormData({
          ...formData,
          isPending: false,
          appname: "",
          description: "",
          url: "",
        });
        toast.success(sucessMsg, {
          action: {
            label: "Close",
            onClick: () => console.log("Toast dismissed"),
          },
        });
      })
      .catch((err) => {
        console.error(err.response);
        const errMsg: string = err.response.data.error;
        setFormData({ ...formData, isPending: false });
        toast.error(errMsg, {
          action: {
            label: "Close",
            onClick: () => console.log("Toast dismissed"),
          },
        });
      });
  };
  return (
    <>
      <main className="">
        <section className="bg-[url('/image.png')] bg-cover h-screen p-10 flex flex-col gap-8 items-center justify-center">
          <hgroup className="flex flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-white md:text-6xl lg:text-6xl text-4xl font-medium">
              Launch your app for the web
            </h1>
            <p className="md:text-lg lg:text-lg text-sm font-medium text-neutral-100">
              Take the chance to make a request to Magic on the app you would
              like us to showcase.
            </p>
          </hgroup>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white hover:bg-white text-black border-4 border-neutral-300 text-lg w-full max-w-xs p-6">
                Get Started
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Request content
                </DialogTitle>
                <DialogDescription>
                  Fill in the form with the apporpriate information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-4 items-start justify-start">
                  <Label htmlFor="name" className="text-white">
                    App Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3 bg-zinc-900 text-white border-zinc-800 placeholder:text-neutral-500"
                    placeholder="Uploadthing"
                    autoComplete="off"
                    value={formData.appname}
                    onChange={(e) =>
                      setFormData({ ...formData, appname: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-4 items-start justify-start">
                  <Label htmlFor="url" className="text-white">
                    Url
                  </Label>
                  <Input
                    id="url"
                    className="col-span-3 bg-zinc-900 text-white border-zinc-800 placeholder:text-neutral-500"
                    placeholder="https://uploadthing.com"
                    autoComplete="off"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-4 items-start justify-start">
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Uploadthing is a file-upload service that was created by Theo..."
                    className="col-span-3 bg-zinc-900 text-white border-zinc-800 outline-none placeholder:text-neutral-500"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="bg-zinc-900 hover:bg-zinc-800"
                  disabled={formData.isPending}
                  onClick={createRequest}
                >
                  {formData.isPending ? "Please wait..." : "Request"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </main>
      <SignedOut>
        <p>You&apos;re not signed in</p>
      </SignedOut>
    </>
  );
}
