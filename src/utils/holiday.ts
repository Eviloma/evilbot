import dayjs from "dayjs";

type Holiday = "halloween" | "christmas" | null;

export function getHolidayStatus(): Holiday {
  const now = dayjs().set("year", 2000);

  if (now.isAfter("2000-10-25") && now.isBefore("2000-11-4")) {
    return "halloween";
  }

  if (now.isAfter("2000-12-19") || now.isBefore("2000-01-15")) {
    return "christmas";
  }

  return null;
}

export function getTempVoiceName(displayName: string): string {
  switch (getHolidayStatus()) {
    case "halloween":
      return `🦇${displayName}`;
    case "christmas":
      return `⛄${displayName}`;
    default:
      return `🔊${displayName}`;
  }
}
