export function calculateIncrease(current, last) {
  if (last === 0) {
    return current > 0 ? "100% increase" : "0.00% increase";
  }
  const percentageIncrease = (((current - last) / last) * 100).toFixed(2);
  return `${percentageIncrease}% increase`;
}

export function findThisMonthData(data) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(1);
  endOfMonth.setHours(0, 0, 0, 0);

  let newData = data.filter((d) => {
    const date = new Date(d.createdAt);
    return date >= startOfMonth && date < endOfMonth;
  });

  return newData.length;
}
