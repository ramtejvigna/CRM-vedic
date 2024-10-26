import {
    CurrencyDollarIcon,  // More specific to revenue
    UsersIcon,           // Keep this for customers
    DocumentIcon,        // Better for PDFs
    BriefcaseIcon,      // More relevant for employees
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
    {
        color: "gray",
        icon: CurrencyDollarIcon,  // Changed from BanknotesIcon
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
        icon: UsersIcon,  // Kept the same as it's already appropriate
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
        icon: DocumentIcon,  // Changed from UserPlusIcon
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
        icon: BriefcaseIcon,  // Changed from ChartBarIcon
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