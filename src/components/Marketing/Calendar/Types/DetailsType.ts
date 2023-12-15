export type DetailsType = {
  id: number;
  customers: {
    name: string;
    email: string;
    phone: string;
    id: number;
  }[];
  space: number;
  join_web_url: string;
  end_address: string;
  floorOld: number;
  start_address: string;
  friendly_end_address: string;
  friendly_start_address: string;
  floorNew: number;
  status: "upcoming" | "past";
};
