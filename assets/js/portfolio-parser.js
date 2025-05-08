const dataUrl = "/assets/portfolio.txt"

fetch(dataUrl)
  .then((response) => response.text())
  .then((content) => {
    parsePortfolioData(content)
  })
  .catch((error) => {
    document.getElementById("output").textContent = "Error loading data file"
    console.error(error)
  })

function parsePortfolioData(data) {
  const lines = data.split("\n")
  let currentUnitPrice = 1
  let totalUnits = 0
  let userUnits = {}
  let userDeposits = {}
  let userPayouts = {} // New object to store manual payouts (marked with -P)
  let snapshots = [] // Store output snapshots to reverse later

  lines.forEach((line) => {
    if (!line.trim()) return
    const parts = line.split("|")
    if (parts.length < 2) return
    const date = parts[0].trim()
    const rest = parts[1].trim()

    // Handle optional -P suffix
    let isPayout = false
    let cleanRest = rest
    if (rest.includes("-P")) {
      isPayout = true
      cleanRest = rest.replace("-P", "").trim()
    }

    const [namePart, amountPart] = cleanRest.split(":")
    const name = namePart.trim()
    const amount = parseFloat(amountPart.trim())

    if (name.toLowerCase() === "total") {
      if (totalUnits > 0) {
        currentUnitPrice = amount / totalUnits
      } else {
        currentUnitPrice = 1
      }

      let snapshot = `\nDate: ${date}\n`
      for (let user in userUnits) {
        const currentValue = userUnits[user] * currentUnitPrice
        const baseProfit = currentValue - userDeposits[user]
        const manualPayout = userPayouts[user] || 0
        const finalProfit = baseProfit - manualPayout
        snapshot += `${user}: Value = ${currentValue.toFixed(2)}, Profit/Loss = ${finalProfit.toFixed(2)}\n`
      }
      snapshot += `---------------------\n`
      snapshots.push(snapshot)
    } else {
      if (!userUnits[name]) {
        userUnits[name] = 0
        userDeposits[name] = 0
        userPayouts[name] = 0
      }

      if (isPayout) {
        userPayouts[name] += Math.abs(amount) // Track manual payouts
      } else {
        const unitsBought = amount / currentUnitPrice
        userUnits[name] += unitsBought
        userDeposits[name] += amount
        totalUnits += unitsBought
      }
    }
  })

  // Reverse the snapshots so latest date appears first
  document.getElementById("output").textContent = snapshots.reverse().join("")
}
