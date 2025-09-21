export function formatVND(amount) {
  if (amount == null) return "0 vnd";
  return new Intl.NumberFormat("vi-VN").format(amount) + " vnd";
}

export function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng từ 0-11
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const formatTime = (timeString) => {
  if (!timeString) return "";

  const parts = timeString.split(":");
  if (parts.length < 2) return timeString;

  const hour = parts[0];
  const minute = parts[1];

  return `${hour}:${minute}`;
};

export function convertStatusToStep(status) {
  switch (status) {
    case "Booked":
      return 1;
    case "Vehicle Received":
      return 1;
    case "Completed":
      return 3;
    case "Canceled":
      return 4;

    default:
      break;
  }
}

export const generateStepAppointmentColor = (status = 1) => {
  switch (status) {
    case 1:
      return {
        color: "#3065e0ff",
        bgColor: "#FFF8F3",
      };
    case 2:
      return {
        color: "#FF6B35",
        bgColor: "#FFF8F3",
      };
    case 3:
      return {
        color: "#00BCD4",
        bgColor: "#F0FDFF",
      };
    case 4:
      return {
        color: "#2fc254ff",
        bgColor: "#F0FDFF",
      };
    default:
      return {
        color: "#FF6B35",
        bgColor: "#FFF8F3",
      };
  }
};
