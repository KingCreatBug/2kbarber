/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box" >Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener("template-loaded", initJsToggle);

function initJsToggle() {
    $$(".js-toggle").forEach((button) => {
        const target = button.getAttribute("toggle-target");
        if (!target) {
            document.body.innerText = `Cần thêm toggle-target cho: ${button.outerHTML}`;
        }
        button.onclick = (e) => {
            e.preventDefault();

            if (!$(target)) {
                return (document.body.innerText = `Không tìm thấy phần tử "${target}"`);
            }
            const isHidden = $(target).classList.contains("hide");

            requestAnimationFrame(() => {
                $(target).classList.toggle("hide", !isHidden);
                $(target).classList.toggle("show", isHidden);
            });
        };
        document.onclick = function (e) {
            if (!e.target.closest(target)) {
                const isHidden = $(target).classList.contains("hide");
                if (!isHidden) {
                    button.click();
                }
            }
        };
    });
}

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

// Mo Trang
function moTrang() {
    window.location.href = "shop.html";
}

// Điều chỉnh số lượng sản phẩm
document.addEventListener("DOMContentLoaded", function () {
    const plusButton = document.getElementById("plus");
    const minusButton = document.getElementById("minus");
    const quantityDisplay = document.getElementById("quantity");
    const priceDisplay = document.getElementById("total");
    let quantity = 1;
    const basePrice = 50; // Giá ban đầu của sản phẩm

    // Tăng số lượng
    plusButton.addEventListener("click", () => {
        quantity++;
        quantityDisplay.textContent = quantity;
        priceDisplay.textContent = `$${(quantity * basePrice).toFixed(2)}`;
    });

    // Giảm số lượng (nhưng không được dưới 1)
    minusButton.addEventListener("click", function () {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
            priceDisplay.textContent = `$${(quantity * basePrice).toFixed(2)}`;
        }
    });
});

// Chuyển tab
document.addEventListener("DOMContentLoaded", function () {
    const tabItems = document.querySelectorAll(".prod-bot__item");
    const tabContents = document.querySelectorAll(".prod-bot__text");

    tabItems.forEach((item, index) => {
        item.addEventListener("click", function () {
            // Xóa class active khỏi tất cả các mục và nội dung
            tabItems.forEach((tab) =>
                tab.classList.remove("prod-bot__item--active")
            );
            tabContents.forEach((content) =>
                content.classList.remove("prod-bot__text--active")
            );

            // Thêm class active cho tab và nội dung được nhấn
            item.classList.add("prod-bot__item--active");
            tabContents[index].classList.add("prod-bot__text--active");
        });
    });
});

// Chọn màu
document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử màu sắc và hình ảnh tương ứng
    const colorElements = document.querySelectorAll(".prod-left__color");
    const productImages = {
        blue: document.getElementById("prodBlue"),
        white: document.getElementById("prodWhite"),
        silver: document.getElementById("prodSilver"),
        gray: document.getElementById("prodGray"),
        darkBlue: document.getElementById("prodDarkBlue"),
        green: document.getElementById("prodGreen"),
        pink: document.getElementById("prodPink"),
        red: document.getElementById("prodRed"),
    };

    // Ẩn tất cả hình ảnh
    function hideAllImages() {
        Object.values(productImages).forEach((img) => {
            img.classList.remove("prod-right__img--active");
        });
    }

    // Hiển thị hình ảnh dựa trên màu được chọn
    function showImageByColor(colorId) {
        if (productImages[colorId]) {
            productImages[colorId].classList.add("prod-right__img--active");
        }
    }

    // Lắng nghe sự kiện click vào từng phần tử màu
    colorElements.forEach((colorElement) => {
        colorElement.addEventListener("click", function () {
            // Loại bỏ lớp active khỏi tất cả các màu
            colorElements.forEach((el) =>
                el.classList.remove("prod-left__color--active")
            );
            // Thêm lớp active vào màu đã chọn
            this.classList.add("prod-left__color--active");

            // Lấy ID của màu được chọn
            const colorId = this.id;

            // Ẩn tất cả hình ảnh
            hideAllImages();
            // Hiển thị hình ảnh tương ứng với màu được chọn
            showImageByColor(colorId);
        });
    });
});

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
