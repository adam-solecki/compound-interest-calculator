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

  // Dynamically generate a random title for the Results module
  const resultTitles = [
    "Well, would you look at that...",
    "The numbers are in!",
    "You're on the path to riches!",
    "Your future self is thanking you!",
    "Holy smokes!",
    "Let your money do the work!",
    "Small steps today, big results tomorrow",
    "Here's how your wealth stacks up",
    "Your investments are working hard",
    "Your future is shaping up nicely",
    "Patience pays off - here's the proof"
  ];
  const randomTitle = resultTitles[Math.floor(Math.random() * resultTitles.length)];
  document.querySelector(".results h2").innerText = randomTitle;

  let n = compounds; // compounding frequency per year
  let f = depositFrequency; // deposits per year
  let t = years;
  let r = rate;

  // Calculate final amount for the starting investment
  let finalAmount = principal * Math.pow((1 + r / n), (n * t));

  // Add compounded contributions over time
  for (let i = 1; i <= t * f; i++) {
    let yearsRemaining = (t * f - i) / f;
    finalAmount += contribution * Math.pow((1 + r / n), yearsRemaining * n);
  }

  // Prepare arrays for the graph and table
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
  // Bold the future investment value with a highlight matching the Reset button color and place the extra sentence on a new line.
  document.getElementById("result").innerHTML = 
    `In ${years} years, your investment will be worth: <span class="highlight">$${formattedAmount}</span>.<br><br>Let's see how your money works for you over time.`;

  // Populate the growth table
  let tableBody = document.getElementById("growthTable").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";
  for (let i = 0; i < yearsArray.length; i++) {
    let interestEarned = investmentValues[i] - depositValues[i];
    let row = `<tr>
      <td>${yearsArray[i]}</td>
      <td>$${depositValues[i].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>$${interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>$${investmentValues[i].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>`;
    tableBody.innerHTML += row;
  }

  document.getElementById("resultsContainer").style.display = "block";
  drawChart(yearsArray, investmentValues, depositValues);
}

function drawChart(labels, investmentData, depositData) {
  let chartContainer = document.querySelector(".chart-container");
  // Remove extra horizontal margins for the chart to expand fully within its container
  chartContainer.style.marginLeft = "0";
  chartContainer.style.marginRight = "0";
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
          label: 'Total investment value ($)',
          data: investmentData,
          borderColor: '#27372d',
          backgroundColor: 'rgba(39,55,45,0.2)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3
        },
        {
          label: 'Total deposits ($)',
          data: depositData,
          borderColor: '#68916a',
          backgroundColor: 'rgba(104,145,106,0.2)',
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
        legend: { display: false },
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
              if (tooltipItem.datasetIndex !== 0) return null;
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
        x: { 
          title: { display: true, text: 'Years' },
          ticks: { padding: 10 }
        },
        y: { 
          title: { display: false },
          ticks: { 
            padding: 10,
            callback: function(value) { 
              return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
          }
        }
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

function removePercentage(input) {
  input.value = input.value.replace(/[%]/g, '');
}

function resetCalculator() {
  document.getElementById("principal").value = "";
  document.getElementById("contribution").value = "";
  document.getElementById("rate").value = "";
  document.getElementById("years").value = "";
  document.getElementById("contributionFrequency").selectedIndex = 0;
  document.getElementById("compounds").selectedIndex = 0;
  document.getElementById("resultsContainer").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", function() {
  var acc = document.getElementsByClassName("accordion");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      panel.style.display = (panel.style.display === "block") ? "none" : "block";
    });
  }
});
