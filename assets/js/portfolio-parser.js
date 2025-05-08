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
  let entriesByDate = {}

  // Step 1: Group lines by date
  lines.forEach((line) => {
    if (!line.trim()) return
    const parts = line.split("|")
    if (parts.length < 2) return
    const date = parts[0].trim()
    const entry = parts[1].trim()
    if (!entriesByDate[date]) entriesByDate[date] = []
    entriesByDate[date].push(entry)
  })

  let currentUnitPrice = 1
  let totalUnits = 0
  let userUnits = {}
  let userDeposits = {}
  let userPayouts = {}
  let snapshots = []

  const sortedDates = Object.keys(entriesByDate).sort()

  sortedDates.forEach((date) => {
    const entries = entriesByDate[date]

    // Process payouts and deposits first
    entries.forEach((entry) => {
      if (entry.toLowerCase().startsWith("total")) return

      let isPayout = false
      let cleanEntry = entry
      if (entry.includes("-P")) {
        isPayout = true
        cleanEntry = entry.replace("-P", "").trim()
      }

      const [namePart, amountPart] = cleanEntry.split(":")
      const name = namePart.trim()
      const amount = parseFloat(amountPart.trim())

      if (!userUnits[name]) {
        userUnits[name] = 0
        userDeposits[name] = 0
        userPayouts[name] = 0
      }

      if (isPayout) {
        userPayouts[name] += Math.abs(amount)
      } else {
        const unitsBought = amount / currentUnitPrice
        userUnits[name] += unitsBought
        userDeposits[name] += amount
        totalUnits += unitsBought
      }
    })

    // Process totals after all deposits/payouts
    entries.forEach((entry) => {
      if (!entry.toLowerCase().startsWith("total")) return

      const [_, amountPart] = entry.split(":")
      const amount = parseFloat(amountPart.trim())

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
    })
  })

  document.getElementById("output").textContent = snapshots.reverse().join("")
}
