export const formatDate = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("vi-VN").format(new Date(date));
};
