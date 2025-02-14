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
    let amount = principal;
    let depositSum = principal;

    let values = [];
    let depositValues = [];
    let yearsArray = [];

    for (let i = 1; i <= totalPeriods; i++) {
        depositSum += contribution * (compounds / contributionFrequency); // Sum up all contributions
        amount = (amount + (contribution * (compounds / contributionFrequency))) * (1 + compoundRate); // Apply compound growth

        if (i % compounds === 0) {
            values.push(amount);
            depositValues.push(depositSum);
            yearsArray.push(i / compounds);
        }
    }

    let formattedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById("result").innerText = `Total sum of investments after ${years} years is $${formattedAmount}.`;
    document.getElementById("resultsContainer").style.display = "block";

    drawChart(yearsArray, values, depositValues);
}

function drawChart(labels, investmentData, depositData) {
    let ctx = document.getElementById("investmentChart").getContext("2d");
    document.querySelector(".chart-container").style.display = "block";

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Investment Growth ($)',
                    data: investmentData,
                    borderColor: '#8cb47c',
                    backgroundColor: 'rgba(140, 180, 124, 0.2)',
                    borderWidth: 2,
                    pointRadius: 2
                },
                {
                    label: 'Total Deposits ($)',
                    data: depositData,
                    borderColor: '#e6c634',
                    backgroundColor: 'rgba(230, 198, 52, 0.2)',
                    borderWidth: 2,
                    pointRadius: 2
                }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
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
