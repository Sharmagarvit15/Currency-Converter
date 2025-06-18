const BASE_URL = "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=879f9e38d5014cc5b117dd961805f0a5";

const dropdowns = document.querySelectorAll(".dropdown select");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const btn = document.querySelector("form button");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    upflag(evt.target);
  });
}

const upflag = (element) => {
  let currCode = element.value;
  let countrycode = countryList[currCode];
  let srclink = `https://flagsapi.com/${countrycode}/flat/64.png`;
  let image = element.parentElement.querySelector("img");
  image.src = srclink;
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    const fromRate = parseFloat(data.rates[fromcurr.value]);
    const toRate = parseFloat(data.rates[tocurr.value]);

    if (!fromRate || !toRate) throw new Error("Invalid currency codes");

    const exchangeRate = toRate / fromRate;
    const finalAmount = (amtVal * exchangeRate).toFixed(2);

    msg.innerText = `${amtVal} ${fromcurr.value} = ${finalAmount} ${tocurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error("Exchange rate error:", error);
  }
};

btn.addEventListener("click", (e) => {
  e.preventDefault(); // Prevents form from refreshing the page
  updateExchangeRate();
});
