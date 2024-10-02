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
// let hasAnimated = false;

// window.addEventListener("scroll", function () {
//     scrollHeader();
// });

// function scrollHeader() {
//     const logo = document.getElementById("logo");
//     const header = document.getElementById("header");
//     const newspaperSpinning = [
//         { transform: "translateY(-50px)" },
//         { transform: "translateY(0px)" },
//     ];

//     const newspaperTiming = {
//         duration: 900,
//         iterations: 1,
//     };

//     if (document.documentElement.scrollTop > 800 && !hasAnimated) {
//         logo.style.display = "none";
//         header.style.position = "fixed";
//         header.style.padding = "5px";
//         header.animate(newspaperSpinning, newspaperTiming);
//         hasAnimated = true;
//     } else if (document.documentElement.scrollTop <= 800 && hasAnimated) {
//         logo.style.display = "flex";
//         header.style.position = "relative";
//         hasAnimated = false;
//     }
// }

// Mo Trang
function moTrang() {
    window.location.href = "shop.html";
}

// Pagination Shop
const dataShop = "assets/js/dataShop.json";

const menu = document.getElementById("shop-menu");
const paginationContainer = document.getElementById("pagination");
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const filterButton = document.getElementById("filter-button");
const sortSelect = document.getElementById("sort"); // Thêm phần tử sắp xếp

// Nút lọc theo loại sản phẩm
const categoryButtons = document.querySelectorAll(".shop-filter__btn-cate");

menu.innerHTML = "";

let page = 0; // Trang hiện tại
let perPage = 12; // Số mục trên mỗi trang
let totalItems = 0; // Tổng số mục sau khi lọc
let filteredData = []; // Dữ liệu đã lọc để hiển thị
let selectedCategory = ""; // Mặc định không có bộ lọc loại sản phẩm

// Gắn sự kiện cho các nút lọc theo loại sản phẩm
categoryButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        selectedCategory = e.target.value; // Cập nhật loại sản phẩm được chọn dựa trên nút được nhấn
        page = 0; // Quay lại trang đầu
        getData(); // Tải lại và lọc dữ liệu
    });
});

// Gắn sự kiện cho nút lọc
filterButton.addEventListener("click", () => {
    page = 0; // Quay lại trang đầu
    getData(); // Tải lại và lọc dữ liệu
});

// Gắn sự kiện cho việc thay đổi cách sắp xếp
sortSelect.addEventListener("change", () => {
    page = 0; // Quay lại trang đầu
    sortData(); // Sắp xếp và cập nhật dữ liệu
});

// Hàm lấy dữ liệu và lọc
function getData() {
    fetch(dataShop)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Phản hồi mạng không hợp lệ");
            }
            return response.json();
        })
        .then((data) => {
            // Lấy giá trị lọc giá
            const minPrice = parseFloat(minPriceInput.value) || 0;
            const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

            // Lọc dữ liệu dựa trên loại sản phẩm được chọn và khoảng giá
            filteredData = data.filter((item) => {
                const itemPrice = parseFloat(item.price.replace(/[$,]/g, ""));
                return (
                    (!selectedCategory || item.category === selectedCategory) && // Kiểm tra nếu loại sản phẩm khớp
                    itemPrice >= minPrice &&
                    itemPrice <= maxPrice // Kiểm tra khoảng giá
                );
            });

            totalItems = filteredData.length; // Cập nhật tổng số mục sau khi lọc

            if (totalItems === 0) {
                // Nếu không có sản phẩm phù hợp
                menu.innerHTML =
                    '<div class="error"><section class="error-content"><h2 class="error-content__title">No products match</h2><p class="error-content__desc">Sorry, the product you are looking for does not exist. If you think something is broken, it is not :)</p><a href="/" class="error-content__btn">Go To Home</a></section><img src="assets/img/error.png" class="error__img" /></div>';
                paginationContainer.innerHTML = ""; // Xóa phân trang nếu không có sản phẩm
            } else {
                // Nếu có sản phẩm phù hợp
                sortData(); // Gọi hàm sắp xếp trước khi hiển thị
                setupPagination(); // Thiết lập phân trang
            }
        })
        .catch((error) => {
            console.error("Đã xảy ra sự cố với thao tác fetch:", error);
            menu.innerHTML =
                '<p class="error">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>';
        });
}

// Hàm sắp xếp dữ liệu dựa trên lựa chọn
function sortData() {
    const sortValue = sortSelect.value;

    if (sortValue === "price-asc") {
        filteredData.sort(
            (a, b) =>
                parseFloat(a.price.replace(/[$,]/g, "")) -
                parseFloat(b.price.replace(/[$,]/g, ""))
        );
    } else if (sortValue === "price-desc") {
        filteredData.sort(
            (a, b) =>
                parseFloat(b.price.replace(/[$,]/g, "")) -
                parseFloat(a.price.replace(/[$,]/g, ""))
        );
    } else if (sortValue === "name-asc") {
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "name-desc") {
        filteredData.sort((a, b) => b.name.localeCompare(a.name));
    }

    updateMenu(filteredData); // Cập nhật menu sau khi sắp xếp
    setupPagination(); // Cập nhật phân trang
}

// Cập nhật menu hiển thị với dữ liệu trang hiện tại
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
                            <img src="${item.img}" alt="${item.name}" class="shop-menu__thumb" />
                        </div>
                        <div class="shop-menu__wrap">
                            <h3 class="shop-menu__title section-heading">${item.name}</h3>
                            <p class="shop-menu__price">$${item.price}</p>
                        </div>
                    </a>
                </article>
            `
        )
        .join("");

    menu.innerHTML = itemsHTML; // Cập nhật menu với các mục đã lọc
}

// Thiết lập nút phân trang
function setupPagination() {
    const pageCount = Math.ceil(totalItems / perPage); // Tính số trang
    paginationContainer.innerHTML = ""; // Xóa phân trang cũ

    // Nút Prev (Trước)
    const prevButton = document.createElement("button");
    prevButton.innerText = "Trước";
    prevButton.classList.add("shop-pagination__button");
    prevButton.disabled = page === 0; // Vô hiệu hóa nếu đang ở trang đầu
    prevButton.addEventListener("click", () => {
        if (page > 0) {
            page--; // Giảm trang
            updateMenu(filteredData); // Cập nhật menu
            setupPagination(); // Cập nhật phân trang
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
            updateMenu(filteredData); // Cập nhật menu
            setupPagination(); // Cập nhật phân trang
        });
        paginationContainer.appendChild(button); // Thêm nút vào phân trang
    }

    // Nút Next (Sau)
    const nextButton = document.createElement("button");
    nextButton.innerText = "Sau";
    nextButton.classList.add("shop-pagination__button");
    nextButton.disabled = page === pageCount - 1; // Vô hiệu hóa nếu đang ở trang cuối
    nextButton.addEventListener("click", () => {
        if (page < pageCount - 1) {
            page++; // Tăng trang
            updateMenu(filteredData); // Cập nhật menu
            setupPagination(); // Cập nhật phân trang
        }
    });
    paginationContainer.appendChild(nextButton); // Thêm nút Next
}

// Lấy dữ liệu ban đầu
getData();

document.addEventListener("DOMContentLoaded", function () {
    // Load header
    fetch("../../templates/header.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("header").innerHTML = data;

            // Gọi hàm kiểm tra trang hiện tại khi header được tải
            setActiveNavbarLink();
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

// Hàm để thiết lập lớp active cho liên kết trong thanh điều hướng
function setActiveNavbarLink() {
    const navbarLinks = document.querySelectorAll(".navbar__link");
    let currentPath = window.location.pathname;

    // Nếu đường dẫn là "/" thì coi như trang chủ (index.html)
    if (currentPath === "/") {
        currentPath = "/index.html";
    }

    let activeLinkFound = false; // Biến để kiểm tra xem đã tìm thấy liên kết active hay chưa

    // Duyệt qua tất cả các liên kết
    navbarLinks.forEach((link) => {
        const linkPath = new URL(link.href).pathname;

        if (linkPath === currentPath && !activeLinkFound) {
            link.classList.add("navbar__link--active");
            activeLinkFound = true; // Đánh dấu rằng đã tìm thấy liên kết active
        } else {
            link.classList.remove("navbar__link--active");
        }
    });
}
