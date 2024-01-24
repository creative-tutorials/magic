import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

async function fetchApps(
  setIsFetching: Dispatch<SetStateAction<boolean>>,
  setData: Dispatch<SetStateAction<never[]>>,
  url: "https://xbrid.vercel.app" | "http://localhost:8080"
) {
  setIsFetching(true);

  axios
    .get(`${url}/api/apps`, {
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_API_KEY,
      },
    })
    .then(async (data) => {
      setData(data.data);
      setIsFetching(false);
    })
    .catch(async (err) => {
      console.error(err.response);
      const errMsg = err.response.data.error;
      setData([]);
      setIsFetching(false);
      toast.error(errMsg, {
        action: {
          label: "Close",
          onClick: () => console.log("Toast dismissed"),
        },
      });
    });
}

async function createRequest(
  isSignedIn: boolean | undefined,
  setFormData: Dispatch<
    SetStateAction<{
      appname: string;
      description: string;
      url: string;
      isPending: boolean;
    }>
  >,
  formData: {
    appname: string;
    description: string;
    url: string;
    isPending: boolean;
  },
  url: "https://xbrid.vercel.app" | "http://localhost:8080",
  user?: { username: string; emailAddresses: { emailAddress: string }[] } | any
) {
  if (!isSignedIn) return;
  setFormData({ ...formData, isPending: true });
  axios
    .post(
      `${url}/api/request`,
      {
        name: formData.appname,
        description: formData.description,
        url: formData.url,
        userName: user?.username,
      },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_API_KEY,
          email: user?.emailAddresses[0].emailAddress,
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
}

export { fetchApps, createRequest };
