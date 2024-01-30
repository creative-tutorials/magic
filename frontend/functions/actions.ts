import { filteredApps } from "@/types/apps";
import { apiURL } from "@/types/url-type";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

async function fetchApps(
  setIsFetching: Dispatch<SetStateAction<boolean>>,
  setData: Dispatch<SetStateAction<never[]>>,
  url: apiURL
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
  url: apiURL,
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
async function searchApp(
  value: SetStateAction<string>,
  setIsFiltering: Dispatch<SetStateAction<boolean>>,
  filteredData: filteredApps,
  setFilteredData: Dispatch<SetStateAction<filteredApps>>,
  url: apiURL
) {
  setIsFiltering(true);
  axios
    .get(`${url}/api/app/${value}`, {
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_API_KEY,
      },
    })
    .then((data) => {
      setFilteredData({
        ...filteredData,
        appicon: data.data.appicon,
        appname: data.data.appname,
        description: data.data.description,
        url: data.data.url,
      });
      setIsFiltering(false);
    })
    .catch((err) => {
      console.error(err.response);
      setIsFiltering(false);
      setFilteredData({
        appicon: "",
        appname: "",
        description: "",
        url: "",
      });
    });
}

async function updateFilter(
  value: SetStateAction<string>,
  url: apiURL,
  setIsFetching: Dispatch<SetStateAction<boolean>>,
  setData: Dispatch<SetStateAction<never[]>>
) {
  setIsFetching(true);
  axios
    .get(`${url}/api/filter/${value}`, {
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_API_KEY,
      },
    })
    .then(async (data) => {
      console.log(data.data);
      setIsFetching(false);
      setData(data.data);
    })
    .catch(async (err) => {
      console.error(err.response);
      const errMsg = err.response.data.error;
      setData([]);
      setIsFetching(false);
    });
}

async function fetchCategories(
  setCatData: Dispatch<
    SetStateAction<{
      categories: never[];
      isLoading: boolean;
    }>
  >,
  catData: {
    categories: never[];
    isLoading: boolean;
  },
  url: apiURL
) {
  setCatData({ ...catData, isLoading: true });
  axios
    .get(`${url}/api/categories`, {
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_API_KEY,
      },
    })
    .then(async (data) => {
      console.log(data.data);
      setCatData({ ...catData, isLoading: false, categories: data.data });
    })
    .catch(async (err) => {
      console.error(err.response);
      setCatData({ ...catData, isLoading: false, categories: [] });
    });
}

export { fetchApps, createRequest, searchApp, updateFilter, fetchCategories };
