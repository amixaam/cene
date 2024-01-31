export default function ConvertTime(time, length) {
    const startTime = new Date(`01/01/2022 ${time}`);
    const endTime = new Date(startTime.getTime() + length * 60000);

    // Format start and end times
    const formattedStartTime = startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    const formattedEndTime = endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return { formattedStartTime, formattedEndTime };
}
