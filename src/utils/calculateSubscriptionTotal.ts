import { Recurrence } from "../entity/Recurrence";

export default (
    price: number,
    recurrence: Recurrence,
    startDateProp: string
) => {
    // Initialize the dates
    const startDate: Date = new Date(startDateProp);
    const date: Date = new Date();

    switch (recurrence) {
        case Recurrence.DAGELIJKS:
            let days: number = Math.round(
                (date.getTime() - startDate.getTime()) / (1000 * 3600 * 24) - 1
            );
            return (days + 1) * price;

        case Recurrence.WEKELIJKS:
            let weeks: number = Math.round(
                (date.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7)
            );

            return (weeks + 1) * price;

        case Recurrence.MAANDELIJKS:
            // Calculate the number of months between the current date and the startDate
            let months =
                date.getMonth() -
                startDate.getMonth() +
                12 * (date.getFullYear() - startDate.getFullYear());

            // Check if the current date is before the day of the startDate in the current month
            if (date.getDate() < startDate.getDate()) {
                months -= 1; // Subtract 1 if a full month hasn't passed
            }

            return (months + 1) * price;

        case Recurrence.JAARLIJKS:
            let years: number = date.getFullYear() - startDate.getFullYear();

            if (date.getMonth() <= startDate.getMonth()) {
                if (date.getDate() <= startDate.getDate()) {
                    years -= 1; // Subtract 1 if a full month hasn't passed
                }
            }

            return (years + 1) * price;

        default:
            throw new Error("Invalid recurrence");
    }
};
