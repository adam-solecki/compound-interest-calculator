function calculateInterest() {
    let principalRaw = document.getElementById("principal").value.replace(/[^0-9.]/g, '');
    let contributionRaw = document.getElementById("contribution").value.replace(/[^0-9.]/g, '');
    let rateRaw = document.getElementById("rate").value.replace(/[^0-9.]/g, '');
    let years = parseFloat(document.getElementById("years").value);
    let compounds = parseInt(document.getElementById("compounds").value);
    let contributionFrequency = parseInt(document.getElementById("contributionFrequency").value);

    let principal = parseFloat(principalRaw) || 0;
    let contribution = parseFloat(contributionRaw) || 0;
    let rate = parseFloat(rateRaw) || 0;

    if (isNaN(principal) || isNaN(contribution) || isNaN(rate) || isNaN(years)) {
        alert("Please enter valid numbers.");
        return;
    }

    let compoundRate = rate / 100 / compounds;
    let totalPeriods = years * compounds;
    let amount = principal * Math.pow((1 + compoundRate), totalPeriods);
    
    let adjustedContributions = contribution * (compounds / contributionFrequency);

    let values = [];
    let yearsArray = [];

    for (let i = 1; i <= totalPeriods; i++) {
        amount += adjustedContributions * Math.pow((1 + compoundRate), (totalPeriods - i));
        if (i % compounds === 0) {
            values.push(amount);
            yearsArray.push(i / compounds);
        }
    }

    let formattedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
    let value = input.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
    input.value = value ? "$" + parseFloat(value).toLocaleString() : "$0";
}

// Format input field with % sign while typing
function formatPercentage(input) {
    let value = input.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
    input.value = value ? value + "%" : "0%";
}
