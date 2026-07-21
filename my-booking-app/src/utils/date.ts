// src/utils/date.ts

/**
 * Returns today's date formatted as YYYY-MM-DD for HTML date inputs.
 */
export const getMinBookingDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    // Pad month and day with a leading zero if under 10
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};