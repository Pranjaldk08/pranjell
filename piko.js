const assignments = [
  {
    id: 1,
    title: "Data Science Case Study",
    subject: "Data Science",
    description: "Finished report with Python analysis, visualizations, and executive summary.",
    price: 22.99,
    deadline: "3 days",
    level: "Intermediate",
  },
  {
    id: 2,
    title: "HTML/CSS Portfolio Project",
    subject: "Web Development",
    description: "Responsive portfolio template with mobile, desktop, and interaction design.",
    price: 14.5,
    deadline: "1 week",
    level: "Beginner",
  },
  {
    id: 3,
    title: "Machine Learning Report",
    subject: "AI & ML",
    description: "Comprehensive ML report with model evaluation and deployment notes.",
    price: 24.99,
    deadline: "5 days",
    level: "Advanced",
  },
  {
    id: 4,
    title: "Business Case Analysis",
    subject: "Business",
    description: "SWOT, financial projections, and go-to-market strategy.",
    price: 18.75,
    deadline: "4 days",
    level: "Intermediate",
  },
  {
    id: 5,
    title: "JavaScript Assignment Kit",
    subject: "Programming",
    description: "Interactive JS exercises with clear instructions and sample code.",
    price: 16.0,
    deadline: "2 days",
    level: "Beginner",
  },
  {
    id: 6,
    title: "Database Design Project",
    subject: "Database",
    description: "ER diagrams, schema scripts, and query examples for an inventory system.",
    price: 20.5,
    deadline: "6 days",
    level: "Intermediate",
  },
];

const cart = [];
const productList = document.getElementById("productList");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const subjectSelect = document.getElementById("subjectSelect");
const levelSelect = document.getElementById("levelSelect");
const scrollProducts = document.getElementById("scrollProducts");
const checkoutButtons = [
  document.getElementById("checkoutNow"),
  document.getElementById("checkoutButton"),
];

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function getSubjects() {
  const subjects = new Set(assignments.map((item) => item.subject));
  return ["all", ...subjects];
}

function renderSubjectOptions() {
  const subjects = getSubjects();
  subjects.forEach((subject) => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject === "all" ? "All subjects" : subject;
    subjectSelect.appendChild(option);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toast.dismissTimer);
  toast.dismissTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 1600);
}

function updateCartCount() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="color:#486581; line-height:1.7;">Your cart is empty. Add an assignment to get started.</p>`;
  } else {
    cart.forEach((item) => {
      const element = document.createElement("div");
      element.className = "cart-item";
      element.innerHTML = `
        <div>
          <h4>${item.title}</h4>
          <p>${item.subject} • ${item.level}</p>
          <small>${item.quantity} × ${formatPrice(item.price)}</small>
        </div>
      `;
      cartItems.appendChild(element);
    });
  }

  cartTotal.textContent = formatPrice(calculateTotal());
  updateCartCount();
}

function addToCart(assignmentId) {
  const item = assignments.find((product) => product.id === assignmentId);
  if (!item) return;

  const cartItem = cart.find((entry) => entry.id === item.id);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  renderCart();
  showToast(`Added “${item.title}” to cart`);
}

function filterAssignments() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedSubject = subjectSelect.value;
  const selectedLevel = levelSelect.value;

  return assignments.filter((assignment) => {
    const matchesSearch = [assignment.title, assignment.subject, assignment.description, assignment.deadline]
      .join(" ")
      .toLowerCase()
      .includes(searchValue);

    const matchesSubject = selectedSubject === "all" || assignment.subject === selectedSubject;
    const matchesLevel = selectedLevel === "all" || assignment.level === selectedLevel;

    return matchesSearch && matchesSubject && matchesLevel;
  });
}

function renderAssignments() {
  const visibleAssignments = filterAssignments();
  productList.innerHTML = "";

  if (visibleAssignments.length === 0) {
    productList.innerHTML = `<p style="grid-column: 1 / -1; color:#486581;">No assignments match your filters. Try a different subject or keyword.</p>`;
    return;
  }

  visibleAssignments.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-meta">
        <span>${product.subject}</span>
        <span>${product.deadline} deadline</span>
      </div>
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <div class="product-info">
        <span class="product-price">${formatPrice(product.price)}</span>
        <button type="button" data-id="${product.id}">Add to cart</button>
      </div>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => addToCart(product.id));

    productList.appendChild(card);
  });
}

function toggleCart(open) {
  cartPanel.classList.toggle("open", open);
}

function setupEventListeners() {
  searchInput.addEventListener("input", renderAssignments);
  subjectSelect.addEventListener("change", renderAssignments);
  levelSelect.addEventListener("change", renderAssignments);

  document.getElementById("cartToggle").addEventListener("click", () => toggleCart(true));
  document.getElementById("closeCart").addEventListener("click", () => toggleCart(false));

  scrollProducts.addEventListener("click", () => {
    document.getElementById("productList").scrollIntoView({ behavior: "smooth" });
  });

  checkoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Add an assignment to your cart before checkout.");
        return;
      }
      toggleCart(true);
      showToast("Checkout ready — complete your order securely.");
    });
  });
}

function init() {
  renderSubjectOptions();
  renderAssignments();
  renderCart();
  setupEventListeners();
}

init();
