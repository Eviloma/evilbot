import dayjs from "dayjs";

type Holiday = "halloween" | null;

export function getHolidayStatus(): Holiday {
  const now = dayjs().set("year", 2000);

  if (now.isAfter("2000-10-25") && now.isBefore("2000-11-6")) {
    return "halloween";
  }

  return null;
}

export function getTempVoiceName(displayName: string): string {
  switch (getHolidayStatus()) {
    case "halloween":
      return `🦇${displayName}`;
    default:
      return `🔊${displayName}`;
  }
}
