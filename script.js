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

    drawChart(yearsArray, values);
}

function drawChart(labels, data) {
    let chartContainer = document.querySelector(".chart-container");
    chartContainer.style.display = "block"; // Show graph container

    let ctx = document.getElementById("investmentChart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy(); // Destroy existing chart before creating a new one
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
            aspectRatio: 2.5, // Makes it wider (horizontal)
            scales: {
                x: { title: { display: true, text: 'Years' } },
                y: { title: { display: true, text: 'Investment Value ($)' } }
            }
        }
    });
}

function formatCurrency(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    input.value = value ? "$" + parseFloat(value).toLocaleString() : "$0";
}

function formatPercentage(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    input.value = value ? value + "%" : "0%";
}
