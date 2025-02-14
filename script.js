function calculateInterest() {
    let principalRaw = document.getElementById("principal").value.replace(/[^0-9.]/g, '');
    let contributionRaw = document.getElementById("contribution").value.replace(/[^0-9.]/g, '');
    let rateRaw = document.getElementById("rate").value.replace(/[^0-9.]/g, '');
    let years = parseFloat(document.getElementById("years").value);
    let compounds = parseInt(document.getElementById("compounds").value);
    let depositFrequency = parseInt(document.getElementById("contributionFrequency").value);

    let principal = parseFloat(principalRaw) || 0;
    let contribution = parseFloat(contributionRaw) || 0;
    let rate = parseFloat(rateRaw) / 100 || 0; // Convert percentage to decimal

    if (isNaN(principal) || isNaN(contribution) || isNaN(rate) || isNaN(years)) {
        alert("Please enter valid numbers.");
        return;
    }

    let n = compounds; // Number of times interest compounds per year
    let f = depositFrequency; // Number of deposits per year
    let t = years;
    let r = rate;

    // ✅ Initial Deposit Compounding
    let finalAmount = principal * Math.pow((1 + r / n), (n * t));

    // ✅ Regular Deposits Compounded Over Time
    for (let i = 1; i <= t * f; i++) {
        let yearsRemaining = (t * f - i) / f;
        finalAmount += contribution * Math.pow((1 + r / n), yearsRemaining * n);
    }

    // ✅ Data Arrays for Graph
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

        // Track total deposited amount at this year
        totalDeposits = principal + contribution * f * i;

        investmentValues.push(tempAmount);
        depositValues.push(totalDeposits);
        yearsArray.push(i.toString()); // Remove "Year" from the tick marks
    }

    let formattedAmount = finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById("result").innerText = `Total sum of investments after ${years} years is $${formattedAmount}.`;

    document.getElementById("resultsContainer").style.display = "block";
    drawChart(yearsArray, investmentValues, depositValues);
}

function drawChart(labels, investmentData, depositData) {
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
            datasets: [
                {
                    label: 'Total Investment Value ($)',
                    data: investmentData,
                    borderColor: '#5ba897',
                    backgroundColor: 'rgba(91, 168, 151, 0.2)',
                    borderWidth: 2,
                    pointRadius: 4, // Bigger point for better visibility
                    pointHoverRadius: 6, // Make it pop when hovered
                    tension: 0.3 // Smooth line curve
                },
                {
                    label: 'Total Deposits ($)',
                    data: depositData,
                    borderColor: '#f4a261',
                    backgroundColor: 'rgba(244, 162, 97, 0.2)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [5, 5] // Dashed line to differentiate
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2.5,
            plugins: {
                tooltip: {
                    mode: 'index', // Combine tooltips
                    intersect: false, // Show both lines' values at the same time
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker background for readability
                    padding: 12, // Increased padding
                    cornerRadius: 8, // Rounded edges for style
                    titleMarginBottom: 6, // Space between title and content
                    bodySpacing: 6, // Space between lines inside tooltip
                    callbacks: {
                        title: function (tooltipItems) {
                            return `Year ${tooltipItems[0].label}`; // Fix "Year Year X" issue
                        },
                        label: function (tooltipItem) {
                            let investment = tooltipItem.dataset.data[tooltipItem.dataIndex];
                            let deposits = depositData[tooltipItem.dataIndex];
                            let percentageGain = ((investment - deposits) / deposits) * 100;

                            return [
                                `Total Investment Value: $${investment.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                                `Total Deposit Sum: $${deposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                                `Percentage Gain: ${percentageGain.toFixed(2)}%`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Years' }
                },
                y: {
                    title: { display: true, text: 'Investment Value ($)' }
                }
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
