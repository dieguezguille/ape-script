// Holders de SOUP
// Holders de BNB
// APY de la Pool

const axios = require("axios").default;
const WALLET_ADDRESS = "0x12848cabc163d81ff286b996b88fbd1c5b370592";
let SOUP_PRICE, WBNB_PRICE;
let SOUP_BNB_LP_PRICE;
let SOUP_QTY, WBNB_QTY;

function roundValue(value) {
  return (Math.round(value * 100) / 100).toFixed(2);
}

function showPrice(tokenName, price) {
  console.log(`${tokenName} price is: $${roundValue(price)}`);
}

function showTvl(
  lpTokenName,
  firstTokenQty,
  firstTokenPrice,
  secondTokenQty,
  secondTokenPrice
) {
  console.log(
    `${lpTokenName} TVL is: $${roundValue(calculateLpTvl(
      firstTokenQty,
      firstTokenPrice,
      secondTokenQty,
      secondTokenPrice
    ))}`
  );
}

function showPoolTokensQty(tokenName, quantity) {
  console.log(`${tokenName} quantity: ${quantity}`);
}

function calculateLpTvl(
  firstTokenQty,
  firstTokenPrice,
  secondTokenQty,
  secondTokenPrice
) {
  return firstTokenQty * firstTokenPrice + secondTokenQty * secondTokenPrice;
}

axios
  .get("https://yw-prices.herokuapp.com/api/prices")
  .then(function (response) {
    SOUP_PRICE = response.data.prices.SOUP;
    WBNB_PRICE = response.data.prices.WBNB;
    showPrice("SOUP", SOUP_PRICE);
    showPrice("WBNB", WBNB_PRICE);
  })
  .catch(function (error) {
    console.log(error);
  });

axios
  .get("https://api.beefy.finance/lps")
  .then(function (response) {
    SOUP_BNB_LP_PRICE = response.data["soup-soup-bnb"];
    showPrice("SOUP-BNB LP", SOUP_BNB_LP_PRICE);
  })
  .catch(function (error) {
    console.log(error);
  });

axios
  .get(`https://yieldwatch.net/api/all/${WALLET_ADDRESS}?platforms=beefy`)
  .then(function (response) {
    SOUP_QTY = response.data.result.BeefyFinance.LPVaults.vaults[1].LPInfo.poolToken0;
    WBNB_QTY = response.data.result.BeefyFinance.LPVaults.vaults[1].LPInfo.poolToken1;
    showPoolTokensQty("SOUP", roundValue(SOUP_QTY));
    showPoolTokensQty("WBNB", roundValue(WBNB_QTY));

    showTvl("SOUP-BNB LP", SOUP_QTY, SOUP_PRICE, WBNB_QTY, WBNB_PRICE);
  })
  .catch(function (error) {
    console.log(error);
  });
