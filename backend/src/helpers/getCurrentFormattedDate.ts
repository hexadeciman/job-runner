export function getCurrentFormattedDate() {
    const currentDate = new Date();

    // Get the timezone offset in minutes
    const timezoneOffset = currentDate.getTimezoneOffset();
    
    // Convert the timezone offset to hours and minutes
    const timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const timezoneMinutes = Math.abs(timezoneOffset) % 60;

    // Create the timezone offset string in the format +/-HH:MM
    const timezoneOffsetString = (timezoneOffset < 0 ? '+' : '-') +
                                 (timezoneHours < 10 ? '0' : '') + timezoneHours +
                                 ':' +
                                 (timezoneMinutes < 10 ? '0' : '') + timezoneMinutes;

    // Format the date in the required format
    const formattedDate = currentDate.toISOString().replace('Z', timezoneOffsetString);

    return formattedDate;
}
