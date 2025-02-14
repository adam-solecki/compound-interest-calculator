function calculateInterest() {
    let principalRaw = document.getElementById("principal").value.replace(/[^0-9.]/g, '');
    let contributionRaw = document.getElementById("contribution").value.replace(/[^0-9.]/g, '');
    let rate = parseFloat(document.getElementById("rate").value);
    let years = parseFloat(document.getElementById("years").value);
    let compounds = parseInt(document.getElementById("compounds").value);
    let contributionFrequency = parseInt(document.getElementById("contributionFrequency").value);

    let principal = parseFloat(principalRaw) || 0;
    let contribution = parseFloat(contributionRaw) || 0;

    if (isNaN(principal) || isNaN(contribution) || isNaN(rate) || isNaN(years)) {
        alert("Please enter valid numbers.");
        return;
    }

    let compoundRate = rate / 100 / compounds;
    let totalPeriods = years * compounds;
    let amount = principal * Math.pow((1 + compoundRate), totalPeriods);

    // Convert contribution frequency to match compounding periods
    let adjustedContributions = contribution * (compounds / contributionFrequency);

    // Add contributions over time
    for (let i = 1; i <= totalPeriods; i++) {
        amount += adjustedContributions * Math.pow((1 + compoundRate), (totalPeriods - i));
    }

    // Format final amount with commas
    let formattedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Updated result message format
    document.getElementById("result").innerText = `Total sum of investments after ${years} years is $${formattedAmount}.`;
}

// Format input field with $ sign while typing
function formatCurrency(input) {
    let value = input.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
    if (!isNaN(value) && value !== "") {
        input.value = "$" + parseFloat(value).toLocaleString();
    } else {
        input.value = "$0"; // Default to $0 if empty
    }
}
