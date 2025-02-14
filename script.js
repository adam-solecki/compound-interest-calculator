function calculateInterest() {
    let principalRaw = document.getElementById("principal").value.replace(/,/g, '');
    let contributionRaw = document.getElementById("contribution").value.replace(/,/g, '');
    let rate = parseFloat(document.getElementById("rate").value);
    let years = parseFloat(document.getElementById("years").value);
    let compounds = parseInt(document.getElementById("compounds").value);

    let principal = parseFloat(principalRaw);
    let contribution = parseFloat(contributionRaw);

    if (isNaN(principal) || isNaN(contribution) || isNaN(rate) || isNaN(years)) {
        alert("Please enter valid numbers.");
        return;
    }

    let totalMonths = years * 12;
    let compoundRate = rate / 100 / compounds;

    let amount = principal * Math.pow((1 + compoundRate), (compounds * years));

    // Add monthly contributions compounded over time
    for (let i = 1; i <= totalMonths; i++) {
        amount += contribution * Math.pow((1 + compoundRate), (compounds * ((totalMonths - i) / 12)));
    }

    // Format final amount with commas
    let formattedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById("result").innerText = `Final Amount after ${years} years: $${formattedAmount}`;
}

// Format input field with commas while typing
function formatInput(input) {
    let value = input.value.replace(/,/g, ''); // Remove existing commas
    if (!isNaN(value) && value !== "") {
        input.value = parseFloat(value).toLocaleString();
    }
}
