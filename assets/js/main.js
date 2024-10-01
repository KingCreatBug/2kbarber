document.addEventListener("DOMContentLoaded", function () {
    // Load header
    fetch("../../templates/header.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("header").innerHTML = data;
        })
        .catch((error) => console.error("Error loading header:", error));

    // Load footer
    fetch("../../templates/footer.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("footer").innerHTML = data;
        })
        .catch((error) => console.error("Error loading footer:", error));
});

// Menu
// Generic function to show or hide elements based on event type
function toggleVisibility(eventType, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        if (eventType === "mouseenter") {
            element.style.opacity = "1";
            element.style.visibility = "visible";
        } else if (eventType === "mouseleave") {
            element.style.opacity = "0";
            element.style.visibility = "hidden";
        }
    }
}

// Event handler for mouse events
function handleMouseEvent(event, elementId) {
    toggleVisibility(event.type, elementId);
}

// Attach event listeners to buttons
document.querySelectorAll(".menu-container__btn").forEach((button) => {
    const elementId = button.getAttribute("data-target"); // Use data attribute to get corresponding element ID
    button.addEventListener("mouseenter", (event) =>
        handleMouseEvent(event, elementId)
    );
    button.addEventListener("mouseleave", (event) =>
        handleMouseEvent(event, elementId)
    );
});

// Scroll
let hasAnimated = false;

window.addEventListener("scroll", function () {
    scrollHeader();
});

function scrollHeader() {
    const logo = document.getElementById("logo");
    const header = document.getElementById("header");
    const newspaperSpinning = [
        { transform: "translateY(-50px)" },
        { transform: "translateY(0px)" },
    ];

    const newspaperTiming = {
        duration: 900,
        iterations: 1,
    };

    if (document.documentElement.scrollTop > 800 && !hasAnimated) {
        logo.style.display = "none";
        header.style.position = "fixed";
        header.style.padding = "5px";
        header.animate(newspaperSpinning, newspaperTiming);
        hasAnimated = true;
    } else if (document.documentElement.scrollTop <= 800 && hasAnimated) {
        logo.style.display = "flex";
        header.style.position = "relative";
        hasAnimated = false;
    }
}

// Mo Trang
function moTrang() {
    window.location.href = "shop.html";
}

// Button dropdown
function openDrop() {
    const drop = document.getElementById("shopDrop");
    drop.style.opacity = "1";
    drop.style.visibility = "visible";
}

function closeDrop() {
    const drop = document.getElementById("shopDrop");
    drop.style.opacity = "0";
    drop.style.visibility = "hidden";
}

// Gán sự kiện cho nút Filter
document.getElementById("btnDrop").addEventListener("click", function () {
    const drop = document.getElementById("shopDrop");
    if (drop.style.visibility === "visible") {
        closeDrop();
    } else {
        openDrop();
    }
});

document.getElementById("filter-button").addEventListener("click", function () {
    closeDrop();
});

// Pagination Shop
const dataShop = "assets/js/dataShop.json";

const menu = document.getElementById("shop-menu");
const paginationContainer = document.getElementById("pagination");
const productTypeFilter = document.getElementById("product-type-filter");
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const filterButton = document.getElementById("filter-button");

menu.innerHTML = "";

let page = 0; // Trang hiện tại
let perPage = 6; // Số mục trên mỗi trang
let totalItems = 0; // Tổng số mục từ dữ liệu
let filteredData = [];

filterButton.addEventListener("click", () => {
    page = 0; // Reset về trang đầu
    getData(); // Tải lại dữ liệu với bộ lọc
});

function getData() {
    fetch(dataShop)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Phản hồi mạng không hợp lệ");
            }
            return response.json();
        })
        .then((data) => {
            // Lọc dữ liệu dựa trên bộ lọc đã chọn
            const filterValue = productTypeFilter.value;
            const minPrice = parseFloat(minPriceInput.value) || 0;
            const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

            filteredData = data.filter(
                (item) =>
                    (filterValue ? item.category === filterValue : true) &&
                    parseFloat(item.price.replace(/[$,]/g, "")) >= minPrice &&
                    parseFloat(item.price.replace(/[$,]/g, "")) <= maxPrice
            );

            totalItems = filteredData.length; // Cập nhật tổng số mục
            updateMenu(filteredData); // Cập nhật menu với dữ liệu đã lọc
            setupPagination(); // Thiết lập phân trang
        })
        .catch((error) => {
            console.error("Đã xảy ra sự cố với thao tác fetch:", error);
            menu.innerHTML =
                '<p class="error">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>';
        });
}
getData();

// Cập nhật menu với dữ liệu của trang hiện tại
function updateMenu(data) {
    const start = page * perPage;
    const end = start + perPage;
    const paginatedItems = data.slice(start, end);

    const itemsHTML = paginatedItems
        .map(
            (item) => `
            <article class="shop-menu__item">
               <a href="${item.link}">
                    <div class="shop-menu__wrap-img">
                        <img src="${item.img}" alt="" class="shop-menu__img">
                    </div>
                    <h3 class="shop-menu__title">${item.title}</h3>
                    <p class="shop-menu__name">${item.name}</p>
                    <div class="shop-menu__wrap">
                        <p class="shop-menu__price">$${item.price}</p>
                        <div class="shop-menu__box">
                            <img src="./assets/icon/star.svg" alt="">
                            <p class="shop-menu__num">${item.star}</p>
                        </div>
                    </div>
               </a>
            </article>`
        )
        .join("");

    menu.innerHTML = itemsHTML; // Cập nhật menu
}

// Thiết lập phân trang
function setupPagination() {
    const pageCount = Math.ceil(totalItems / perPage); // Tính số trang
    paginationContainer.innerHTML = ""; // Xóa phân trang cũ

    // Nút Prev
    const prevButton = document.createElement("button");
    prevButton.innerText = "Prev";
    prevButton.classList.add("shop-pagination__button");
    prevButton.disabled = page === 0; // Vô hiệu hóa nếu đang ở trang đầu
    prevButton.addEventListener("click", () => {
        if (page > 0) {
            page--; // Giảm trang
            getData(); // Tải lại dữ liệu cho trang mới
        }
    });
    paginationContainer.appendChild(prevButton); // Thêm nút Prev

    // Tạo nút cho từng trang
    for (let i = 0; i < pageCount; i++) {
        const button = document.createElement("button");
        button.innerText = i + 1; // Số trang
        button.classList.add("shop-pagination__button");
        if (i === page) {
            button.classList.add("active"); // Thêm lớp active cho trang hiện tại
        }
        button.addEventListener("click", () => {
            page = i; // Cập nhật trang hiện tại
            getData(); // Tải lại dữ liệu cho trang mới
        });
        paginationContainer.appendChild(button); // Thêm nút vào phân trang
    }

    // Nút Next
    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.classList.add("shop-pagination__button");
    nextButton.disabled = page === pageCount - 1; // Vô hiệu hóa nếu đang ở trang cuối
    nextButton.addEventListener("click", () => {
        if (page < pageCount - 1) {
            page++; // Tăng trang
            getData(); // Tải lại dữ liệu cho trang mới
        }
    });
    paginationContainer.appendChild(nextButton); // Thêm nút Next
}
