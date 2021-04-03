export const calculate = (data, minutes) => {
  const closePrices = data.map((item) => parseFloat(item[4]));
  const dataArrLength = closePrices.length;
  const numberToSplice = dataArrLength - minutes;
  const closes = closePrices.splice(numberToSplice);

  let minClose = Math.min(...closes);
  let maxClose = Math.max(...closes);
  let avgClose = closes.reduce((a, b) => a + b, 0) / closes.length;

  if (avgClose > 10) {
    minClose = minClose.toFixed(2);
    maxClose = maxClose.toFixed(2);
    avgClose = avgClose.toFixed(2);
  }

  if (avgClose > 1 && avgClose < 10) {
    minClose = minClose.toFixed(4);
    maxClose = maxClose.toFixed(4);
    avgClose = avgClose.toFixed(4);
  }

  if (avgClose < 1) {
    minClose = minClose.toFixed(6);
    maxClose = maxClose.toFixed(6);
    avgClose = avgClose.toFixed(6);
  }

  return {
    minClose,
    maxClose,
    avgClose,
  };
};

export function calculations(
  data,
  isBaseAsset,
  calculateHighLowAvg,
  timeInterval
) {
  let minutes;
  switch (timeInterval) {
    case '5m':
      minutes = 5;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '10m':
      minutes = 10;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '15m':
      minutes = 15;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '30m':
      minutes = 30;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '1h':
      minutes = 60;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '2h':
      minutes = 120;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '3h':
      minutes = 180;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '4h':
      minutes = 240;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '5h':
      minutes = 300;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '6h':
      minutes = 360;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '7h':
      minutes = 420;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;
    case '8h':
      minutes = 480;
      calculateHighLowAvg(data, minutes, isBaseAsset);
      break;

    default:
      break;
  }
}
