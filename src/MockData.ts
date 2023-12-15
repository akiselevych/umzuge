import { v1 } from "uuid";

export const data = [
    {
        id: "DEL-010",
        name: "Delivery 10",
        customer: {
            id: "CUST-010",
            name: "Elizabeth Anderson",
        },
        notes: "Leave with receptionist",
        state: "Delivered",
        date: "2023-01-01",
    },
    {
        id: "DEL-011",
        name: "Delivery 11",
        customer: {
            id: "CUST-011",
            name: "John Smith",
        },
        notes: "Handle with care",
        state: "Pending",
        date: "2022-01-01",
    },
    {
        id: "DEL-012",
        name: "Delivery 12",
        customer: {
            id: "CUST-012",
            name: "Emily Johnson",
        },
        notes: "Call before delivery",
        state: "In Progress",
        date: "2021-01-01",
    },
    {
        id: "DEL-013",
        name: "Delivery 13",
        customer: {
            id: "CUST-013",
            name: "Michael Williams",
        },
        notes: "Leave package at backdoor",
        state: "Delivered",
        date: "2020-01-01",
    },
    {
        id: "DEL-014",
        name: "Delivery 14",
        customer: {
            id: "CUST-014",
            name: "Olivia Brown",
        },
        notes: "Signature required",
        state: "Delivered",
        date: "2019-01-01",
    },
    {
        id: "DEL-015",
        name: "Delivery 15",
        customer: {
            id: "CUST-015",
            name: "William Jones",
        },
        notes: "Deliver between 9am-5pm",
        state: "In Progress",
        date: "2018-01-01",
    },
    {
        id: "DEL-016",
        name: "Delivery 16",
        customer: {
            id: "CUST-016",
            name: "Sophia Davis",
        },
        notes: "Do not bend",
        state: "Pending",
        date: "2017-01-01",
    },
    {
        id: "DEL-017",
        name: "Delivery 17",
        customer: {
            id: "CUST-017",
            name: "James Miller",
        },
        notes: "Handle with gloves",
        state: "In Progress",
        date: "2023-02-01",
    },
    {
        id: "DEL-018",
        name: "Delivery 18",
        customer: {
            id: "CUST-018",
            name: "Ava Wilson",
        },
        notes: "Fragile item",
        state: "Delivered",
        date: "2022-02-01",
    },
    {
        id: "DEL-019",
        name: "Delivery 19",
        customer: {
            id: "CUST-019",
            name: "Liam Taylor",
        },
        notes: "Leave in mailbox",
        state: "Delivered",
        date: "2021-02-01",
    },
    {
        id: "DEL-020",
        name: "Delivery 20",
        customer: {
            id: "CUST-020",
            name: "Isabella Garcia",
        },
        notes: "Call for instructions",
        state: "Pending",
        date: "2020-02-01",
    },
    {
        id: "DEL-021",
        name: "Delivery 21",
        customer: {
            id: "CUST-021",
            name: "Mason Martinez",
        },
        notes: "Leave at front desk",
        state: "Delivered",
        date: "2019-02-01",
    },
    {
        id: "DEL-022",
        name: "Delivery 22",
        customer: {
            id: "CUST-022",
            name: "Charlotte Robinson",
        },
        notes: "Handle with care",
        state: "In Progress",
        date: "2018-02-01",
    },
    {
        id: "DEL-023",
        name: "Delivery 23",
        customer: {
            id: "CUST-023",
            name: "Logan Clark",
        },
        notes: "Deliver after 6pm",
        state: "Delivered",
        date: "2017-02-01",
    },
    {
        id: "DEL-024",
        name: "Delivery 24",
        customer: {
            id: "CUST-024",
            name: "Amelia Lewis",
        },
        notes: "Signature required",
        state: "Delivered",
        date: "2023-03-01",
    },
    {
        id: "DEL-025",
        name: "Delivery 25",
        customer: {
            id: "CUST-025",
            name: "Henry Lee",
        },
        notes: "Deliver to back entrance",
        state: "In Progress",
        date: "2022-03-01",
    },
    {
        id: "DEL-026",
        name: "Delivery 26",
        customer: {
            id: "CUST-026",
            name: "Evelyn Walker",
        },
        notes: "Leave with neighbor",
        state: "Pending",
        date: "2021-03-01",
    },
    {
        id: "DEL-027",
        name: "Delivery 27",
        customer: {
            id: "CUST-027",
            name: "Benjamin Young",
        },
        notes: "Do not drop",
        state: "In Progress",
        date: "2020-03-01",
    },
    {
        id: "DEL-028",
        name: "Delivery 28",
        customer: {
            id: "CUST-028",
            name: "Victoria Hall",
        },
        notes: "Handle with gloves",
        state: "Delivered",
        date: "2019-03-01",
    },
    {
        id: "DEL-029",
        name: "Delivery 29",
        customer: {
            id: "CUST-029",
            name: "Andrew Allen",
        },
        notes: "Leave on porch",
        state: "Delivered",
        date: "2018-03-01",
    },
];

export const tablesData = [
    {
        name: "Employees",
        data: [],
    },
    {
        name: "Offers",
        data: [],
    },
    {
        name: "Leads",
        data: [
            {
                KW: { id: v1(), value: 1 },
                LastName: { id: v1(), value: "Doe" },
                FirstName: { id: v1(), value: "John" },
                Email: { id: v1(), value: "john.doe@example.com" },
                Phone: { id: v1(), value: "123-456-7890" },
                Platform: { id: v1(), value: "Website" },
                DesiredAppointment: { id: v1(), value: "2023-06-26" },
                LeadReceivedOn: { id: v1(), value: "2023-06-25" },
                DateOfContactAttempt: { id: v1(), value: "2023-06-27" },
                UGLAvailable: { id: v1(), value: "Yes" },
                PhoneReached: { id: v1(), value: "Yes" },
                MB: { id: v1(), value: "No" },
                Mail: { id: v1(), value: "Yes" },
                SMS: { id: v1(), value: "No" },
                OfferSubmitted: { id: v1(), value: "Yes" },
                Inspection: { id: v1(), value: "No" },
                FollowUp: { id: v1(), value: "Yes" },
                FollowUpDate: { id: v1(), value: "2023-06-30" },
                Note: { id: v1(), value: "This is a note." },
            },
            {
                KW: { id: v1(), value: 2 },
                LastName: { id: v1(), value: "Smith" },
                FirstName: { id: v1(), value: "Jane" },
                Email: { id: v1(), value: "jane.smith@example.com" },
                Phone: { id: v1(), value: "987-654-3210" },
                Platform: { id: v1(), value: "Referral" },
                DesiredAppointment: { id: v1(), value: "2023-07-01" },
                LeadReceivedOn: { id: v1(), value: "2023-06-25" },
                DateOfContactAttempt: { id: v1(), value: "2023-06-28" },
                UGLAvailable: { id: v1(), value: "No" },
                PhoneReached: { id: v1(), value: "No" },
                MB: { id: v1(), value: "Yes" },
                Mail: { id: v1(), value: "No" },
                SMS: { id: v1(), value: "Yes" },
                OfferSubmitted: { id: v1(), value: "No" },
                Inspection: { id: v1(), value: "Yes" },
                FollowUp: { id: v1(), value: "No" },
                FollowUpDate: { id: v1(), value: "2023-07-05" },
                Note: { id: v1(), value: "Another note." },
            },
            {
                KW: { id: v1(), value: 3 },
                LastName: { id: v1(), value: "Johnson" },
                FirstName: { id: v1(), value: "Michael" },
                Email: {
                    id: v1(),
                    value: "michael.johnson@example.com",
                },
                Phone: { id: v1(), value: "555-123-4567" },
                Platform: { id: v1(), value: "Social Media" },
                DesiredAppointment: { id: v1(), value: "2023-07-03" },
                LeadReceivedOn: { id: v1(), value: "2023-06-26" },
                DateOfContactAttempt: { id: v1(), value: "2023-06-29" },
                UGLAvailable: { id: v1(), value: "Yes" },
                PhoneReached: { id: v1(), value: "Yes" },
                MB: { id: v1(), value: "No" },
                Mail: { id: v1(), value: "No" },
                SMS: { id: v1(), value: "Yes" },
                OfferSubmitted: { id: v1(), value: "Yes" },
                Inspection: { id: v1(), value: "Yes" },
                FollowUp: { id: v1(), value: "Yes" },
                FollowUpDate: { id: v1(), value: "2023-07-07" },
                Note: { id: v1(), value: "Additional note." },
            },
            {
                KW: { id: v1(), value: 4 },
                LastName: { id: v1(), value: "Williams" },
                FirstName: { id: v1(), value: "Emily" },
                Email: { id: v1(), value: "emily.williams@example.com" },
                Phone: { id: v1(), value: "222-333-4444" },
                Platform: { id: v1(), value: "Advertisement" },
                DesiredAppointment: { id: v1(), value: "2023-07-05" },
                LeadReceivedOn: { id: v1(), value: "2023-06-27" },
                DateOfContactAttempt: { id: v1(), value: "2023-06-30" },
                UGLAvailable: { id: v1(), value: "Yes" },
                PhoneReached: { id: v1(), value: "No" },
                MB: { id: v1(), value: "Yes" },
                Mail: { id: v1(), value: "Yes" },
                SMS: { id: v1(), value: "No" },
                OfferSubmitted: { id: v1(), value: "No" },
                Inspection: { id: v1(), value: "Yes" },
                FollowUp: { id: v1(), value: "Yes" },
                FollowUpDate: { id: v1(), value: "2023-07-10" },
                Note: { id: v1(), value: "Another additional note." },
            },
            {
                KW: { id: v1(), value: 5 },
                LastName: { id: v1(), value: "Brown" },
                FirstName: { id: v1(), value: "Oliver" },
                Email: { id: v1(), value: "oliver.brown@example.com" },
                Phone: { id: v1(), value: "999-888-7777" },
                Platform: { id: v1(), value: "Website" },
                DesiredAppointment: { id: v1(), value: "2023-07-08" },
                LeadReceivedOn: { id: v1(), value: "2023-06-28" },
                DateOfContactAttempt: { id: v1(), value: "2023-07-01" },
                UGLAvailable: { id: v1(), value: "No" },
                PhoneReached: { id: v1(), value: "Yes" },
                MB: { id: v1(), value: "No" },
                Mail: { id: v1(), value: "No" },
                SMS: { id: v1(), value: "Yes" },
                OfferSubmitted: { id: v1(), value: "Yes" },
                Inspection: { id: v1(), value: "No" },
                FollowUp: { id: v1(), value: "No" },
                FollowUpDate: { id: v1(), value: "2021-07-10" },
                Note: { id: v1(), value: "Just a note." },
            },
        ],
    },
];

export const expensesData = [
    { id: "1", name: "Lebensmittel", expense: 25.5 },
    { id: "2", name: "Transport", expense: 15.2 },
    { id: "3", name: "Unterkunft", expense: 50.0 },
    { id: "4", name: "Kleidung", expense: 42.9 },
    { id: "5", name: "Freizeitaktivitäten", expense: 30.8 },
    { id: "6", name: "Gesundheitspflege", expense: 18.3 },
    { id: "7", name: "Bildung", expense: 12.6 },
    { id: "8", name: "Haushaltswaren", expense: 35.7 },
    { id: "9", name: "Restaurants", expense: 45.2 },
    { id: "10", name: "Versicherungen", expense: 28.1 },
    { id: "11", name: "Elektronik", expense: 67.9 },
    { id: "12", name: "Reisen", expense: 82.4 },
    { id: "13", name: "Geschenke", expense: 20.6 },
    { id: "14", name: "Sport", expense: 14.9 },
    { id: "15", name: "Kommunikation", expense: 37.3 },
];
export const IncomingInvoicesData = [
    {
        id: "1",
        fourTwoFiveOne: "Value 1",
        reciveDate: "2023-06-28",
        accountSum: "1001 €",
        deadline: "2023-07-05",
        isChecked: true,
        isArchived: false,
        biller: "Wuttke Umzüge",
    },
    {
        id: "2",
        fourTwoFiveOne: "Value 2",
        reciveDate: "2023-06-28",
        accountSum: "1002 €",
        deadline: "2023-07-05",
        isChecked: false,
        isArchived: true,
        biller: "Wuttke Umzüge",
    },
    {
        id: "3",
        fourTwoFiveOne: "Value 3",
        reciveDate: "2023-06-28",
        accountSum: "1003 €",
        deadline: "2023-07-05",
        isChecked: true,
        isArchived: false,
        biller: "Wuttke Umzüge",
    },
    {
        id: "4",
        fourTwoFiveOne: "Value 4",
        reciveDate: "2023-06-28",
        accountSum: "1004 €",
        deadline: "2023-07-05",
        isChecked: false,
        isArchived: true,
        biller: "Wuttke Umzüge",
    },
    {
        id: "5",
        fourTwoFiveOne: "Value 5",
        reciveDate: "2023-06-28",
        accountSum: "1005 €",
        deadline: "2023-07-05",
        isChecked: true,
        isArchived: false,
        biller: "Wuttke Umzüge",
    },
    {
        id: "6",
        fourTwoFiveOne: "Value 6",
        reciveDate: "2023-06-28",
        accountSum: "1006 €",
        deadline: "2023-07-05",
        isChecked: false,
        isArchived: false,
        biller: "Wuttke Umzüge",
    },
    {
        id: "7",
        fourTwoFiveOne: "Value 7",
        reciveDate: "2023-06-28",
        accountSum: "1007 €",
        deadline: "2023-07-05",
        isChecked: true,
        isArchived: false,
        biller: "Wuttke Umzüge",
    },
    {
        id: "8",
        fourTwoFiveOne: "Value 8",
        reciveDate: "2023-06-28",
        accountSum: "1008 €",
        deadline: "2023-07-05",
        isChecked: false,
        isArchived: true,
        biller: "Wuttke Umzüge",
    },
    {
        id: "9",
        fourTwoFiveOne: "Value 9",
        reciveDate: "2023-06-28",
        accountSum: "1009 €",
        deadline: "2023-07-05",
        isChecked: true,
        isArchived: false,
        biller: "Wuttke Umzüge",
    },
    {
        id: "10",
        fourTwoFiveOne: "Value 10",
        reciveDate: "2023-06-28",
        accountSum: "1010 €",
        deadline: "2023-07-05",
        isChecked: false,
        isArchived: true,
        biller: "Wuttke Umzüge",
    },
    {
        id: "11",
        fourTwoFiveOne: "Value 11",
        reciveDate: "2023-06-28",
        accountSum: "1011 €",
        deadline: "2023-07-05",
        isChecked: true,
        isArchived: false,
        biller: "Wuttke Umzüge",
    },
    {
        id: "12",
        fourTwoFiveOne: "Value 12",
        reciveDate: "2023-06-28",
        accountSum: "1012 €",
        deadline: "2023-07-05",
        isChecked: false,
        isArchived: false,
        biller: "Wuttke Umzüge",
    },
    {
        id: "13",
        fourTwoFiveOne: "Value 13",
        reciveDate: "2023-06-28",
        accountSum: "1013 €",
        deadline: "2023-07-05",
        isChecked: true,
        isArchived: true,
        biller: "Wuttke Umzüge",
    },
];
