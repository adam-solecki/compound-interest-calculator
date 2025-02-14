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

  let n = compounds; // compounding frequency per year
  let f = depositFrequency; // deposits per year
  let t = years;
  let r = rate;

  // Calculate final amount for the initial deposit
  let finalAmount = principal * Math.pow((1 + r / n), (n * t));

  // Add compounded contributions
  for (let i = 1; i <= t * f; i++) {
    let yearsRemaining = (t * f - i) / f;
    finalAmount += contribution * Math.pow((1 + r / n), yearsRemaining * n);
  }

  // Prepare data arrays for the graph
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
          borderColor: '#27372d', // Matches heading color
          backgroundColor: 'rgba(39,55,45,0.2)', // Semi-transparent version of #27372d
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3
        },
        {
          label: 'Total Deposits ($)',
          data: depositData,
          borderColor: '#68916a', // Matches button color
          backgroundColor: 'rgba(104,145,106,0.2)', // Semi-transparent version of #68916a
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2.5,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          align: 'start'
        },
        tooltip: {
          displayColors: false,
          mode: 'index',
          intersect: false,
          bodyFont: { size: 10 },
          titleFont: { size: 10 },
          callbacks: {
            title: function (tooltipItems) {
              return `Year ${tooltipItems[0].label}`;
            },
            label: function (tooltipItem) {
              if (tooltipItem.datasetIndex !== 0) {
                return null;
              }
              let investment = tooltipItem.dataset.data[tooltipItem.dataIndex];
              let deposits = depositData[tooltipItem.dataIndex];
              return [
                `Investment total: $${investment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `Deposit total: $${deposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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

// Format input field with $ sign while typing
function formatCurrency(input) {
  let value = input.value.replace(/[^0-9.]/g, '');
  input.value = value ? "$" + parseFloat(value).toLocaleString() : "$0";
}

// Format input field with % sign on blur
function formatPercentage(input) {
  let value = input.value.replace(/[^0-9.]/g, '');
  input.value = value ? value + "%" : "0%";
}

// Remove % sign on focus to allow easier editing/backspacing
function removePercentage(input) {
  input.value = input.value.replace(/[%]/g, '');
}
