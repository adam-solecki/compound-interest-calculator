function calculateInterest() {
    let principal = parseFloat(document.getElementById("principal").value);
    let rate = parseFloat(document.getElementById("rate").value);
    let years = parseFloat(document.getElementById("years").value);
    let compounds = parseInt(document.getElementById("compounds").value);

    if (isNaN(principal) || isNaN(rate) || isNaN(years)) {
        alert("Please enter valid numbers.");
        return;
    }

    let amount = principal * Math.pow((1 + rate / (100 * compounds)), (compounds * years));
    let result = `Final Amount after ${years} years: $${amount.toFixed(2)}`;
    
    document.getElementById("result").innerText = result;
}
