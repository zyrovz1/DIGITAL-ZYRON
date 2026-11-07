const WHATSAPP = "5575991190972";

const services = [
  {
    id: 1,
    name: "Site profissional",
    description: "Site moderno e responsivo para apresentar sua empresa.",
    price: 300
  },
  {
    id: 2,
    name: "Cardápio digital",
    description: "Cardápio online com categorias, produtos e preços.",
    price: 300
  },
  {
    id: 3,
    name: "Loja virtual",
    description: "Sua própria vitrine digital para apresentar produtos.",
    price: 500
  },
  {
    id: 4,
    name: "Landing page",
    description: "Página estratégica para divulgar produtos e serviços.",
    price: 250
  },
  {
    id: 5,
    name: "Site personalizado",
    description: "Desenvolvimento sob medida para seu negócio.",
    price: 450
  },
  {
    id: 6,
    name: "Manutenção de sites",
    description: "Correções, atualizações e melhorias.",
    price: 150
  }
];

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("zyron_cart")) || [];
  if (!Array.isArray(cart)) cart = [];
} catch (error) {
  cart = [];
}

const formatMoney = value =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function saveCart() {
  localStorage.setItem("zyron_cart", JSON.stringify(cart));
  renderCart();
}

function renderServices() {
  const list = document.getElementById("serviceList");
  list.innerHTML = "";

  services.forEach(service => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = service.name;

    const description = document.createElement("p");
    description.textContent = service.description;

    const price = document.createElement("strong");
    price.textContent = formatMoney(service.price) + " / mês";

    const button = document.createElement("button");
    button.className = "button";
    button.textContent = "Adicionar ao carrinho";
    button.addEventListener("click", () => addToCart(service.id));

    card.append(title, description, price, button);
    list.appendChild(card);
  });
}

function addToCart(id) {
  const service = services.find(item => item.id === id);
  if (!service) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: service.id, quantity: 1 });
  }

  saveCart();

  const button = document.getElementById("openCart");
  button.classList.add("cart-added");

  setTimeout(() => {
    button.classList.remove("cart-added");
  }, 500);
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const count = document.getElementById("cartCount");
  const totalElement = document.getElementById("cartTotal");
  const quoteNote = document.getElementById("quoteNote");

  container.innerHTML = "";

  cart = cart.filter(item =>
    services.some(service => service.id === item.id) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );

  let total = 0;

  const quantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  count.textContent = quantity;

  if (cart.length === 0) {
    container.innerHTML =
      '<div class="empty-cart">Seu carrinho está vazio.<br>Escolha um serviço para começar.</div>';

    totalElement.textContent = formatMoney(0);
    quoteNote.textContent = "Nenhuma mensalidade selecionada.";
    return;
  }

  cart.forEach(item => {
    const service = services.find(s => s.id === item.id);
    if (!service) return;

    total += service.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const info = document.createElement("div");
    info.className = "cart-info";

    const title = document.createElement("h3");
    title.textContent = service.name;

    const price = document.createElement("p");
    price.textContent =
      formatMoney(service.price) + " / mês";

    info.append(title, price);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Diminuir quantidade");
    minus.onclick = () => changeQuantity(item.id, -1);

    const number = document.createElement("span");
    number.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Aumentar quantidade");
    plus.onclick = () => changeQuantity(item.id, 1);

    const remove = document.createElement("button");
    remove.textContent = "Remover";
    remove.className = "remove-item";
    remove.onclick = () => removeItem(item.id);

    controls.append(minus, number, plus, remove);
    row.append(info, controls);
    container.appendChild(row);
  });

  totalElement.textContent = formatMoney(total) + " / mês";
  quoteNote.textContent =
    "Total das mensalidades selecionadas. Cobrança recorrente mensal.";
}

function changeQuantity(id, amount) {
  const item = cart.find(s => s.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(s => s.id !== id);
  }

  saveCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function openCart() {
  document.getElementById("cartOverlay").classList.add("active");
}

function closeCart() {
  document.getElementById("cartOverlay").classList.remove("active");
}

document.getElementById("openCart").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;

document.getElementById("cartOverlay").onclick = event => {
  if (event.target.id === "cartOverlay") closeCart();
};

document.getElementById("clearCart").onclick = () => {
  if (cart.length === 0) return;

  if (confirm("Deseja realmente limpar o carrinho?")) {
    cart = [];
    saveCart();
  }
};

document.getElementById("checkout").onclick = () => {
  if (cart.length === 0) {
    alert("Adicione algum serviço ao carrinho primeiro.");
    return;
  }

  const lines = cart.map(item => {
    const service = services.find(s => s.id === item.id);
    if (!service) return "";

    return `${service.name} | Quantidade: ${item.quantity} | ${formatMoney(service.price * item.quantity)} / mês`;
  }).filter(Boolean);

  const total = cart.reduce((sum, item) => {
    const service = services.find(s => s.id === item.id);
    return sum + (service ? service.price * item.quantity : 0);
  }, 0);

  const message = [
    "Olá! Gostaria de contratar serviços da Digital Zyron.",
    "",
    ...lines,
    "",
    "TOTAL MENSAL: " + formatMoney(total),
    "",
    "Gostaria de receber informações sobre a contratação e o pagamento das mensalidades."
  ].join("\n");

  window.open(
    "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message),
    "_blank"
  );
};

document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const business = document.getElementById("business").value.trim();
  const details = document.getElementById("details").value.trim();

  const message =
    `Olá! Vim pelo site Digital Zyron.\n\n` +
    `Nome: ${name}\n` +
    `Empresa: ${business || "Não informada"}\n\n` +
    `Projeto:\n${details}`;

  window.open(
    "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message),
    "_blank"
  );
});

renderServices();
renderCart();
