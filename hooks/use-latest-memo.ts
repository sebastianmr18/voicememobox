// /hooks/use-latest-memo.ts
import { useEffect, useState } from "react";
import axios from "axios";

export function useLatestMemo(uuid: string | null) {
  const [memo, setMemo] = useState(null);

  useEffect(() => {
    if (!uuid) return;
    const fetchMemo = async () => {
      try {
        const { data } = await axios.get(`/api/get-latest-memo`, {
          params: { uuid },
        });
        setMemo(data);
      } catch (err) {
        console.error("Error fetching latest memo:", err);
      }
    };

    fetchMemo();
  }, [uuid]);

  return memo;
}
