import axios from "axios";
import { useState, useEffect } from "react";
import { TECHPORT_URL, NASA_API_KEY } from "./constants";

export default function useFetchTechport(path = "", options) {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios({
      url: `${TECHPORT_URL}${path}`,
      params: { api_key: NASA_API_KEY },
    })
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [{ data, error, loading }, setData];
}