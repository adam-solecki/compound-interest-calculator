function calculateInterest() {
    let principal = parseFloat(document.getElementById("principal").value.replace(/[^0-9.]/g, '')) || 0;
    let contribution = parseFloat(document.getElementById("contribution").value.replace(/[^0-9.]/g, '')) || 0;
    let rate = parseFloat(document.getElementById("rate").value.replace(/[^0-9.]/g, '')) / 100 || 0;
    let years = parseFloat(document.getElementById("years").value);
    let compounds = parseInt(document.getElementById("compounds").value);
    let depositFrequency = parseInt(document.getElementById("contributionFrequency").value);

    if (isNaN(years)) {
        alert("Please enter valid numbers.");
        return;
    }

    let n = compounds, f = depositFrequency, t = years, r = rate;
    let finalAmount = principal * Math.pow((1 + r / n), (n * t));

    for (let i = 1; i <= t * f; i++) {
        let yearsRemaining = (t * f - i) / f;
        finalAmount += contribution * Math.pow((1 + r / n), yearsRemaining * n);
    }

    document.getElementById("result").innerText = `Total sum of investments after ${years} years is $${finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    document.getElementById("resultsContainer").style.display = "block";
}

function formatCurrency(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    input.value = value ? "$" + parseFloat(value).toLocaleString() : "$0";
}

function formatPercentage(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    input.value = value ? value + "%" : "0%";
}
