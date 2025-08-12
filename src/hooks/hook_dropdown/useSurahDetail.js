import { useEffect, useState } from "react";

const useSurahDetail = (nomorSurah) => {
  const [surahDetail, setSurahDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(nomorSurah);
    
    if (!nomorSurah) return;

    setLoading(true);

    fetch(`https://quran-api.santrikoding.com/api/surah/${nomorSurah}`)
      .then((res) => res.json())
      .then((data) => {
        setSurahDetail(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching surah detail:", error);
        setSurahDetail(null);
        setLoading(false);
      });
  }, [nomorSurah]);

  return { surahDetail, loading };
};

export default useSurahDetail;
