import {
    BanknotesIcon,
    UserPlusIcon,
    UsersIcon,
    ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
    {
        color: "gray",
        icon: BanknotesIcon,
        title: "Today's Revenue",
        value: "$53k",
        footer: {
            color: "text-green-500",
            value: "+55%",
            label: "than last week",
        },
    },
    {
        color: "gray",
        icon: UsersIcon,
        title: "Today's customers",
        value: "2,300",
        footer: {
            color: "text-green-500",
            value: "+3%",
            label: "than last month",
        },
    },
    {
        color: "gray",
        icon: UserPlusIcon,
        title: "PDFs generated Today",
        value: "3,462",
        footer: {
            color: "text-red-500",
            value: "-2%",
            label: "than yesterday",
        },
    },
    {
        color: "gray",
        icon: ChartBarIcon,
        title: "Total Emloyees",
        value: "$103,430",
        footer: {
            color: "text-green-500",
            value: "+5%",
            label: "than yesterday",
        },
    },
];

export default statisticsCardsData;