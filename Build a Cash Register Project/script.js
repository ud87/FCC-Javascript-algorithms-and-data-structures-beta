let price = 19.5;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const totalPrice = document.getElementById("price");

const changeDue = document.getElementById("change-due");

const purchaseBtn = document.getElementById("purchase-btn");

const cidWebElement = document.getElementById("cash-in-drawer");

totalPrice.innerText += ` ${price}`; //updates the html text with price and displays on page

let change;

//create coin object to follow coin / note rules
let coinObj = {
  "ONE HUNDRED": 100,
  TWENTY: 20,
  TEN: 10,
  FIVE: 5,
  ONE: 1,
  QUARTER: 0.25,
  DIME: 0.1,
  NICKEL: 0.05,
  PENNY: 0.01,
};
//console.log(coinObj);

//create a function to extract keys from coin object we will need this later
function findKey(object, value) {
  for (const key in object) {
    if (object[key] === value) {
      return key;
    }
  }
  return null; //if value is not found
}

//function used to update cash in drawer value on web page
function updateCid(cid) {
  cidWebElement.innerHTML = `
    <p>Change in drawer:</p>
    <p>Pennies: $${cid[0][1]}</p>
    <p>Nickels: $${cid[1][1]}</p>
    <p>Dimes: $${cid[2][1]}</p>
    <p>Quarters: $${cid[3][1]}</p>
    <p>Ones: $${cid[4][1]}</p>
    <p>Fives: $${cid[5][1]}</p>
    <p>Tens: $${cid[6][1]}</p>
    <p>Twenties: $${cid[7][1]}</p>
    <p>Hundreds: $${cid[8][1]}</p>
    `;
}

//function used to convert cash in drawer value to a specific format to be outputted in result later
function cidValueParsed(cid) {
  let convertedData = [];
  cid.map(([key, value]) => {
    if (value !== 0) {
      //gets rid of all values with 0
      convertedData.push(` ${key}: $${value}`);
    }
  });
  return convertedData.join(""); //join gets rid of , and outputs e.g. TWENTY: $60 TEN: $20 FIVE: $15 ONE: $1 QUARTER: $0.5 DIME: $0.2 PENNY: $0.04
}

//function used to convert change Array to a specific format to be outputted in result later
function changeArrParsed(changeArr) {
  let convertedData = [];
  changeArr.map(([key, value]) => {
    convertedData.push(` ${key}: $${value}`);
  });
  return convertedData.join(""); //join gets rid of , and outputs only the change e.g.
}

/////Event listener
purchaseBtn.addEventListener("click", () => {
  //get the cash value once purchase button is pressed
  const cash = document.getElementById("cash").value;
  change = cash - price;
  console.log(`Change is: ${change}`);
  //console.log(change);

  if (cash < price) {
    return alert("Customer does not have enough money to purchase the item");
  } else if (cash == price) {
    changeDue.style.color = "white";
    return (changeDue.innerText =
      "No change due - customer paid with exact cash");
  }
  checkCashRegister(price, cid);
});

//Main function
function checkCashRegister(price, cid, changeArr = [], cidArr = []) {
  //console.log(cid);

  //convert cid array to cid obj
  let cidObj = Object.fromEntries(cid);
  //console.log(cidObj);

  //combine coinObj value and cidObj value
  let coinCidObj = Object.fromEntries(
    //below array is converted back into object
    //Object entries converts coinObj into array, we will retain coinObj value and pull value from cidObj
    Object.entries(coinObj).map(([key, value]) => [value, cidObj[key]])
  );
  //console.log(coinCidObj); //outputs {1: 90, 5: 55, 10: 20, 20: 60, 100: 100, 0.25: 4.25, 0.1: 3.1, 0.05: 2.05, 0.01: 1.01}

  //coin array  to loop systematically one after another, extracted from coinObj
  let coinArr = Object.entries(coinObj).map(([key, value]) => value);
  //console.log(coinArr); //outputs [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01]

  //loop through coinArr which is coin value higher to lower value coin/notes
  for (let i = 0; i < coinArr.length; i++) {
    if (change >= coinArr[i]) {
      //convert num into str as coinArr[index] is string
      let coinCid = coinCidObj[coinArr[i].toString()];
      console.log(coinCid);
      console.log("****");

      if (coinCid > change) {
        console.log("coinCid is greater than change");
        //round down change to get how much to get out
        let cidOut = Math.floor(change / coinArr[i]) * coinArr[i];
        console.log(`cidOut: ${cidOut}`);

        //re-calculate the change after taking above cash in drawer out
        change = (change - cidOut).toFixed(2);
        console.log(`existing change ${change}`);

        //cash in drawer = coin cash in drawer - cash in drawer out
        coinCid = coinCid - cidOut;
        console.log(`coinCid: ${coinCid}`);
        cidArr.push(coinCid); //push coin cid in drawer

        //Update the main cid variable value as we take out cash from drawer i.e. cidOut
        let coin = findKey(coinObj, coinArr[i]); //used to find the coin from digits for e.g. 10 should output Ten
        //console.log(coin);
        let cidIndex = cid.findIndex((element) => element[0] === coin); //find the index of the coin in cid, element[0] is used because of data format for e.g. [TEN: 10]
        //console.log("Cid Index is " + cidIndex);
        cid.splice(cidIndex, 1, [coin, coinCid]); //updates cid value by replacing 1 element at cidIndex index with data in format [coin, coinCid]

        //push coin and cash in drawer out to change array
        changeArr.push([findKey(coinObj, coinArr[i]), cidOut]);
      } else if (coinCid < change) {
        //if  coinCid === 0 then do not take any cash out and change remains the same
        if (coinCid === 0) {
          change = change - coinCid;
        } else {
          //if coin cid cash in drawer is smaller than change then take out all cash in drawer
          let cidOut = coinCid;
          console.log(`cidOut: ${cidOut}`);

          //re-calculate the change after taking above cash in drawer out
          change = (change - cidOut).toFixed(2);
          console.log("existing change: " + change);

          //cash in drawer = coin cash in drawer - cash in drawer out
          coinCid = coinCid - cidOut;
          console.log(`coinCid: ${coinCid}`);
          cidArr.push(coinCid); //push coin cid in drawer

          //push coin and cash in drawer out to change array
          changeArr.push([findKey(coinObj, coinArr[i]), cidOut]);
        }
      } else if (coinCid === change) {
        //if coinCid = change then cash in drawer out must be equal to coin cash in drawer
        let cidOut = coinCid;
        console.log(`cidOut: ${cidOut}`);

        //re-calculate the change after taking above cash in drawer out
        change = (change - cidOut).toFixed(2);
        console.log("existing change: " + change);

        //coin cash in drawer = coin cash in drawer - cash in drawer out
        coinCid = coinCid - cidOut;
        console.log("existing coinCid: " + coinCid);
        cidArr.push(coinCid); //push cid in drawer

        //push coin and cash in drawer out to change array
        changeArr.push([findKey(coinObj, coinArr[i]), cidOut]);
      }
    }
  }

  console.log(`This is change Arr: `);
  console.log(changeArr);

  console.log(`This is cidArr ${cidArr}`);

  //total cash taken out
  let cidOutTotal = changeArr.reduce((acc, currentItem) => {
    //to handle decimal convert to integers by multiplying by 2 for 2 decimal places
    return acc + currentItem[1];
  }, 0);

  //convert cash taken out to 2 decimal places
  cidOutTotal = cidOutTotal.toFixed(2);
  console.log("This is cidOutTotal " + cidOutTotal);

  console.log("Final existing change is " + change);

  //convert cash taken out to 2 decimal places
  cidOutTotal = Number.parseFloat(cidOutTotal).toFixed(2);

  //total cid cash in drawer
  let cidTotal = cidArr.reduce((acc, currItem) => {
    return acc + currItem;
  }, 0);
  console.log(`Total cid: ${cidTotal}`);

  //console.log(change);
  if (change > 0 && change > cidTotal) {
    console.log('"Status: INSUFFICIENT_FUNDS"');
    changeDue.innerText = "Status: INSUFFICIENT_FUNDS";
    changeDue.style.color = "red";
  } else if (change == 0 && cidTotal == 0) {
    console.log("Status: CLOSED " + cidValueParsed(cid));
    changeDue.innerText = "Status: CLOSED " + cidValueParsed(cid);
    changeDue.style.color = "white";
  } else {
    console.log("Status: OPEN" + changeArrParsed(changeArr));
    changeDue.innerText = "Status: OPEN" + changeArrParsed(changeArr);
    console.log(cid);
    updateCid(cid);
    changeDue.style.color = "#66FF00";
  }
}
