const textInput = document.getElementById("text-input");
const checkBtn = document.querySelector("#check-btn");
let result = document.querySelector("#result");



const palindrome = () => {
    //get text input value entered by user
    const textInputVal = textInput.value;

    if (textInputVal.length === 0 || textInputVal === null){
        alert("Please input a value");
    } else {
        //convert str into array and filter out all non alpha numeric digits
        const arr = Array.from(textInputVal).filter((elem)=>elem.match(/[A-Za-z0-9]/ig)); //i ignores lower case and upper case
        
        //convert arr into string all chars to lowercase
        const str = arr.join("").toLowerCase();

        //create an empty reverse array
        const arrReverse = [];

        //push characters from str into arrReverse in reverse order
        for (let i=str.length; i>= 0; i--){
            arrReverse.push(str[i])
        }

        //convert arrReverse into string 
        const strReverse = arrReverse.join("");

        //condition to check if palindrome or not a palindrome
        if (str === strReverse){
            result.innerHTML = `<p style ="color:green" ><strong>${textInputVal}</strong> is a palindrome</p>`;
        } else {
            result.innerHTML = `<p style ="color:red"><strong>${textInputVal}</strong> is not a palindrome</p>`;
        }

        console.log(strReverse);
    }
}

checkBtn.addEventListener("click", palindrome);