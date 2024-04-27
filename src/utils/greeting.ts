export const getGreeting = (): string => {
  const date = new Date();
  const hour = date.getHours();

  if (hour >= 0 && hour < 12) {
    return "Good morning, ";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon, ";
  } else {
    return "Good evening, ";
  }
};
