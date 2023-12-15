import { DetailsType } from "./DetailsType";

export type MeetingType = {
  status: "Online" | "Offline";
  time: string;
  name: string;
  kind: string;
  details: DetailsType;
};
