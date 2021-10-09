import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
export const timeAgo = new TimeAgo("en-US");

export const timeFormatting = (postDateInMs) => {
  if (Date.now() - postDateInMs <= 24 * 60 * 60 * 1000) {
    return timeAgo.format(new Date(postDateInMs), "mini-now");
  } else {
    return timeAgo.format(new Date(postDateInMs), "twitter");
  }
};
