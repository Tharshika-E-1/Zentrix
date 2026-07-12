import axios from "axios";
import * as cheerio from "cheerio";

const fetchWebsiteContent = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0.0.0 Safari/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);

    $("script").remove();
    $("style").remove();
    $("noscript").remove();
    $("svg").remove();

    const text = $("body").text();

    return text.replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error("Website Fetch Error:", error.message);
    throw new Error(error.message);
  }
};

export default fetchWebsiteContent;