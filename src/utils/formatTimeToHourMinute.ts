export function formatTimeToHourMinute(time: string) {
    const timeArray = time.split(":");
    const hour = timeArray[0];
    const minute = timeArray[1];
  
    return `${hour}:${minute}`;
  }