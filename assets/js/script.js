// Mortgage Calculator
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mortgageForm");
  const resultText = document.getElementById("result");

  const inputs = {
    price: document.getElementById("price"),
    down: document.getElementById("down"),
    rate: document.getElementById("rate"),
    term: document.getElementById("term"),
  };

  // Noktalı format (price, down, term) - sadece rakam
  function formatWithDots(el) {
    el.addEventListener("input", () => {
      const raw = el.value.replace(/\./g, "").replace(/\D/g, "");
      if (!raw) return (el.value = "");

      const cursor = el.selectionStart;
      const prevLength = el.value.length;

      const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      el.value = formatted;

      const newLength = el.value.length;
      const offset = newLength - prevLength;
      el.setSelectionRange(cursor + offset, cursor + offset);
    });
  }

  // Ondalıklı format (rate)
  function formatDecimal(el) {
    el.addEventListener("input", () => {
      let raw = el.value.replace(/[^0-9.]/g, "");
      const parts = raw.split(".");
      if (parts.length > 2) return;
      el.value = parts[0] + (parts[1] ? "." + parts[1].slice(0, 2) : "");
    });
  }

  formatWithDots(inputs.price);
  formatWithDots(inputs.down);
  formatWithDots(inputs.term);
  formatDecimal(inputs.rate);

  function showError(msg) {
    resultText.textContent = msg;
    resultText.classList.remove("text-green-400");
    resultText.classList.add("text-red-400");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const price = parseFloat(inputs.price.value.replace(/\./g, ""));
    const down = parseFloat(inputs.down.value.replace(/\./g, ""));
    const rate = parseFloat(inputs.rate.value);
    const term = parseInt(inputs.term.value.replace(/\./g, ""));

    if (isNaN(price) || price < 10000 || price > 1000000000)
      return showError("Price must be between $10,000 and $1,000,000,000.");
    if (isNaN(down) || down < 0 || down >= price)
      return showError("Down payment must be less than home price.");
    if (isNaN(rate) || rate < 0 || rate > 30)
      return showError("Interest rate must be between 0% and 30%.");
    if (isNaN(term) || term < 5 || term > 40)
      return showError("Loan term must be between 5 and 40 years.");

    const loan = price - down;
    const monthlyRate = rate / 100 / 12;
    const totalMonths = term * 12;

    const monthly =
      monthlyRate === 0
        ? loan / totalMonths
        : (loan * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const formattedLoan = new Intl.NumberFormat("en-US").format(loan);
    const formattedPayment = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(monthly);

    resultText.innerHTML = `
      <span class="block mb-1 text-sm text-white/70">Loan Amount: $${formattedLoan}</span>
      <strong class="text-2xl text-green-400">Estimated Monthly Payment: ${formattedPayment}</strong>
    `;
    resultText.classList.remove("text-red-400");
    resultText.classList.add("text-green-400");
  });
});

// Mortgage Calculator
