export const getPriceFromString = (inputString) => {
    const pricePattern = /[\d',]+/;
    const match = inputString.match(pricePattern);
    return match ? parseFloat(match[0].replace(/[',]/g, '')) : 0;
}
