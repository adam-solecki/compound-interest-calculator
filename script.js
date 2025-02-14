function calculateInterest() {
    let principal = parseFloat(document.getElementById("principal").value.replace(/[^0-9.]/g, '')) || 0;
    let contribution = parseFloat(document.getElementById("contribution").value.replace(/[^0-9.]/g, '')) || 0;
    let rate = parseFloat(document.getElementById("rate").value.replace(/[^0-9.]/g, '')) / 100 || 0;
    let years = parseFloat(document.getElementById("years").value);
    let compounds = parseInt(document.getElementById("compounds").value);
    let depositFrequency = parseInt(document.getElementById("contributionFrequency").value);

    if (isNaN(principal) || isNaN(contribution) || isNaN(rate) || isNaN(years)) {
        alert("Please enter valid numbers.");
        return;
    }

    let n = compounds;
    let f = depositFrequency;
    let t = years;
    let r = rate;

    let finalAmount = principal * Math.pow((1 + r / n), (n * t));
    let resultsTable = document.querySelector("#resultsTable tbody");
    resultsTable.innerHTML = ""; // Clear previous data

    let investmentValues = [];
    let depositValues = [];
    let yearsArray = [];
    let totalDeposits = principal;

    for (let i = 0; i <= t; i++) {
        let tempAmount = principal * Math.pow((1 + r / n), (n * i));

        for (let j = 1; j <= i * f; j++) {
            let yearsRemaining = (i * f - j) / f;
            tempAmount += contribution * Math.pow((1 + r / n), yearsRemaining * n);
        }

        totalDeposits = principal + contribution * f * i;
        investmentValues.push(tempAmount);
        depositValues.push(totalDeposits);
        yearsArray.push(i.toString());

        let gainPercentage = ((tempAmount - totalDeposits) / totalDeposits) * 100;
        resultsTable.innerHTML += `<tr>
            <td>Year ${i}</td>
            <td>$${tempAmount.toFixed(2)}</td>
            <td>$${totalDeposits.toFixed(2)}</td>
            <td>${gainPercentage.toFixed(2)}%</td>
        </tr>`;
    }

    document.getElementById("result").innerText = `Total sum of investments after ${years} years is $${finalAmount.toFixed(2)}.`;
    document.getElementById("resultsContainer").style.display = "block";

    drawChart(yearsArray, investmentValues, depositValues);
}

function drawChart(labels, investmentData, depositData) {
    let ctx = document.getElementById("investmentChart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Investment Value ($)',
                    data: investmentData,
                    borderColor: '#5ba897',
                    backgroundColor: 'rgba(91, 168, 151, 0.2)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Total Deposits ($)',
                    data: depositData,
                    borderColor: '#f4a261',
                    backgroundColor: 'rgba(244, 162, 97, 0.2)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    padding: 12, // Adds extra padding
                    callbacks: {
                        title: (tooltipItems) => `Year ${tooltipItems[0].label}`,
                        label: (tooltipItem) => {
                            let deposits = depositData[tooltipItem.dataIndex];
                            let investment = tooltipItem.dataset.data[tooltipItem.dataIndex];
                            let gainPercentage = ((investment - deposits) / deposits) * 100;
                            return [
                                `Total Investment Value: $${investment.toFixed(2)}`,
                                `Total Deposit Sum: $${deposits.toFixed(2)}`,
                                `Percentage Gain: ${gainPercentage.toFixed(2)}%`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: { title: { display: true, text: 'Years' } },
                y: { title: { display: true, text: 'Investment Value ($)' } }
            }
        }
    });
}

// ✅ Format input field with $ sign while typing
function formatCurrency(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    input.value = value ? "$" + parseFloat(value).toLocaleString() : "$0";
}

// ✅ Format input field with % sign while typing
function formatPercentage(input) {
    let value = input.value.replace(/[^0-9.]/g, '');
    input.value = value ? value + "%" : "0%";
}
