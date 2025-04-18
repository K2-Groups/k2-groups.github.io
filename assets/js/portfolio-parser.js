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
  let output = ""

  lines.forEach((line) => {
    if (!line.trim()) return
    const parts = line.split("|")
    if (parts.length < 2) return
    const date = parts[0].trim()
    const rest = parts[1].trim()
    const [namePart, amountPart] = rest.split(":")
    const name = namePart.trim()
    const amount = parseFloat(amountPart.trim())

    if (name.toLowerCase() === "total") {
      if (totalUnits > 0) {
        currentUnitPrice = amount / totalUnits
      } else {
        currentUnitPrice = 1
      }

      output += `\nDate: ${date}\n`
      for (let user in userUnits) {
        const currentValue = userUnits[user] * currentUnitPrice
        const profit = currentValue - userDeposits[user]
        output += `${user}: Value = ${currentValue.toFixed(
          2
        )}, Profit/Loss = ${profit.toFixed(2)}\n`
      }
      output += `---------------------\n`
    } else {
      if (!userUnits[name]) {
        userUnits[name] = 0
        userDeposits[name] = 0
      }
      const unitsBought = amount / currentUnitPrice
      userUnits[name] += unitsBought
      userDeposits[name] += amount
      totalUnits += unitsBought
    }
  })

  document.getElementById("output").textContent = output
}
