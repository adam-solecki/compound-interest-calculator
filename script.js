function calculateInterest() {
    let principalRaw = document.getElementById("principal").value.replace(/[^0-9.]/g, '');
    let contributionRaw = document.getElementById("contribution").value.replace(/[^0-9.]/g, '');
    let rateRaw = document.getElementById("rate").value.replace(/[^0-9.]/g, '');
    let years = parseFloat(document.getElementById("years").value);
    let compounds = parseInt(document.getElementById("compounds").value);
    let contributionFrequency = parseInt(document.getElementById("contributionFrequency").value);

    let principal = parseFloat(principalRaw) || 0;
    let contribution = parseFloat(contributionRaw) || 0;
    let rate = parseFloat(rateRaw) / 100 || 0; // Convert percentage to decimal

    if (isNaN(principal) || isNaN(contribution) || isNaN(rate) || isNaN(years)) {
        alert("Please enter valid numbers.");
        return;
    }

    let n = compounds; // Compounding periods per year
    let f = contributionFrequency; // Deposit frequency per year
    let t = years;
    let r = rate;

    // 1️⃣ Compound the Initial Deposit Over Time
    let initialAmount = principal * Math.pow((1 + r / n), (n * t));

    // 2️⃣ Compound Regular Deposits Over Time
    let contributionAmount = 0;
    if (r > 0) {
        contributionAmount = contribution * ((Math.pow(1 + (r / n), n * t) - 1) / (r / n));
    } else {
        contributionAmount = contribution * f * t; // If interest rate is 0, simple addition
    }

    let finalAmount = initialAmount + contributionAmount;

    // 3️⃣ Generate Data for the Graph
    let values = [];
    let yearsArray = [];

    for (let i = 0; i <= t; i++) {
        let tempInitial = principal * Math.pow((1 + r / n), (n * i));
        let tempContribution = 0;

        if (r > 0) {
            tempContribution = contribution * ((Math.pow(1 + (r / n), n * i) - 1) / (r / n));
        } else {
            tempContribution = contribution * f * i;
        }

        values.push(tempInitial + tempContribution);
        yearsArray.push(i);
    }

    let formattedAmount = finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById("result").innerText = `Total sum of investments after ${years} years is $${formattedAmount}.`;

    document.getElementById("resultsContainer").style.display = "block";
    drawChart(yearsArray, values);
}

function drawChart(labels, data) {
    let chartContainer = document.querySelector(".chart-container");
    chartContainer.style.display = "block";

    let ctx = document.getElementById("investmentChart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Investment Growth ($)',
                data: data,
                borderColor: '#5ba897',
                backgroundColor: 'rgba(91, 168, 151, 0.2)',
                borderWidth: 2,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2.5,
            scales: {
                x: { title: { display: true, text: 'Years' } },
                y: { title: { display: true, text: 'Investment Value ($)' } }
            }
        }
    });
}

// Format input field with $ sign while typing
function formatCurrency(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    input.value = value ? "$" + parseFloat(value).toLocaleString() : "$0";
}

// Format input field with % sign while typing
function formatPercentage(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    input.value = value ? value + "%" : "0%";
}
