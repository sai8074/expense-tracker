const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const now = new Date();
document.getElementById("month").innerText =
  `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function addExpense() {
  const amount = Number(amountInput.value);
  if (!amount) return;

  expenses.push({
    amount,
    category: category.value,
    date: new Date().toISOString()
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));
  amountInput.value = "";
  note.value = "";
  render();
}

function render() {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  const monthly = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const total = monthly.reduce((s,e)=>s+e.amount,0);
  document.getElementById("total").innerText = `₹${total}`;

  const byCat = {};
  monthly.forEach(e => byCat[e.category]=(byCat[e.category]||0)+e.amount);

  const top = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById("topCategory").innerText =
    top ? `Top spend: ${top[0]} (₹${top[1]})` : "No expenses yet";

  drawPie(byCat);
  drawLine(monthly);
}

function drawPie(data) {
  if (window.pie) pie.destroy();
  pie = new Chart(pieChart,{
    type:"doughnut",
    data:{labels:Object.keys(data),
      datasets:[{data:Object.values(data)}]}
  });
}

function drawLine(data) {
  const map = {};
  data.forEach(e=>{
    const d=new Date(e.date).getDate();
    map[d]=(map[d]||0)+e.amount;
  });

  if (window.line) line.destroy();
  line = new Chart(lineChart,{
    type:"line",
    data:{
      labels:Object.keys(map),
      datasets:[{data:Object.values(map), fill:true}]
    }
  });
}

render();
