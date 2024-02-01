const number = document.getElementById("number");
const convertBtn = document.getElementById("convert-btn");
const output = document.getElementById("output");
//console.log(convertBtn);

const romanNumeralsMapping = [
    {
        1000: "M",
        900: "CM",
        500: "D",
        400: "CD",
        100: "C",
        90: "XC",
        50: "L",
        40: "XL",
        10: "X",
        9: "IX",
        5: "V",
        4: "IV",
        1: "I",
    }
];

const convertToRoman = (num, arr) => {

    //extract all keys in an array so we can find key value less than or equal to given argument
    const keys = Object.keys(romanNumeralsMapping[0]);
    

    //find key value less than or equal to num argument, if not met then return 1000 as it is the largest
    let closestValue = keys.reduce((acc, currentElem, index) => {
        const nextValue = keys[index + 1];
        return (currentElem <= num && nextValue > num) ? currentElem : acc;
    }, 1000);
    

    //get equivalent roman number of closest value and push it to arr
    arr.push(romanNumeralsMapping[0][closestValue]);
    

    //calculate the remaining num
    num -= closestValue;
    

    //use recursion to loop through until num is equal to zero
    if (num === 0){             //base case
        const result = arr.join("");
        output.innerText = result;
        output.style.visibility = "visible";
    } else {
        convertToRoman(num, arr);
    }

};



//add event listener 
convertBtn.addEventListener("click", () => {
    let inputVal = number.value;      //do not convert into integer yet as we cannot do user check input otherwise
    const array = [];

    //check user input for blannk or characters 
    if (inputVal === "" || inputVal === null || inputVal == "e"){
        output.innerText = "Please enter a valid number";
        output.style.visibility = "visible";
        return;                                 //exit program early
    }

    inputVal = parseInt(inputVal); //convert input value into number prior to processing

    if (inputVal <= 0 ){
        output.innerText = "Please enter a number greater than or equal to 1";
        output.style.visibility = "visible";
        return;
    } else if (inputVal >= 4000){
        output.innerText = "Please enter a number less than or equal to 3999";
        return;
    }

    convertToRoman(inputVal, array);
});

