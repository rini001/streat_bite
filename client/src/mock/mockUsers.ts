import { User } from "@/types";

const mockUsers: User[] = [
  {
    id: "u1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    savedVendors: ["v3", "v9"],
  },
  {
    id: "u2",
    name: "Mike Peterson",
    email: "mike.p@example.com",
    savedVendors: ["v1", "v6"],
  },
  {
    id: "u3",
    name: "Lisa Kim",
    email: "lisa.k@example.com",
    savedVendors: ["v2", "v4", "v7"],
  },
  {
    id: "u4",
    name: "David Chen",
    email: "david.c@example.com",
    savedVendors: ["v2", "v6", "v10"],
  },
  {
    id: "u5",
    name: "Alex Thompson",
    email: "alex.t@example.com",
    savedVendors: ["v3", "v7", "v10"],
  },
];

export default mockUsers;
