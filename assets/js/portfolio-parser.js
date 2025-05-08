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

  // Group lines by date
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
  let monthlyProfits = {}
  let totalProfitAllTime = 0
  let totalPayouts = 0

  const sortedDates = Object.keys(entriesByDate).sort()

  sortedDates.forEach((date) => {
    const entries = entriesByDate[date]
    const month = date.slice(0, 7) // "YYYY-MM"

    // Process deposits and payouts first
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
        totalPayouts += Math.abs(amount)
      } else {
        const unitsBought = amount / currentUnitPrice
        userUnits[name] += unitsBought
        userDeposits[name] += amount
        totalUnits += unitsBought
      }
    })

    // Then process total and calculate profit snapshot
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
      let totalProfitThisMonth = 0

      for (let user in userUnits) {
        const currentValue = userUnits[user] * currentUnitPrice
        const baseProfit = currentValue - userDeposits[user]
        const manualPayout = userPayouts[user] || 0
        const finalProfit = baseProfit - manualPayout

        totalProfitThisMonth += finalProfit

        snapshot += `${user}: Value = ${currentValue.toFixed(2)}, Profit/Loss = ${finalProfit.toFixed(2)}\n`
      }

      if (!monthlyProfits[month]) monthlyProfits[month] = 0
      monthlyProfits[month] += totalProfitThisMonth
      totalProfitAllTime += totalProfitThisMonth

      snapshot += `---------------------\n`
      snapshots.push(snapshot)
    })
  })

  let summary = "\n==== Summary ===="
  for (let month in monthlyProfits) {
    summary += `\n${month}: Net Profit = ${monthlyProfits[month].toFixed(2)}`
  }
  summary += `\n\nTotal Profit (All Time): ${totalProfitAllTime.toFixed(2)}`
  summary += `\nTotal Payouts: ${totalPayouts.toFixed(2)}`
  summary += `\nNet Profit After Payouts: ${(totalProfitAllTime - totalPayouts).toFixed(2)}`

  document.getElementById("output").textContent = snapshots.reverse().join("") + summary
}
