const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
        setActiveNavbarLink(); // Gọi hàm thiết lập lớp active cho navbar
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                $(selector).innerHTML = html;
                localStorage.setItem(path, html);
                setActiveNavbarLink(); // Gọi hàm thiết lập lớp active cho navbar
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

// Hàm để thiết lập lớp active cho liên kết trong thanh điều hướng
function setActiveNavbarLink() {
    const navbarLinks = $$(".navbar__link"); // Sử dụng $$ để lấy tất cả các liên kết
    let currentPath = window.location.pathname;

    // Nếu đường dẫn là "/" thì coi như trang chủ (index.html)
    if (currentPath === "/") {
        currentPath = "/index.html"; // Coi trang chủ là index.html
    }

    // Duyệt qua tất cả các liên kết
    navbarLinks.forEach((link) => {
        const linkPath = new URL(link.href).pathname; // Lấy đường dẫn của liên kết

        // Kiểm tra xem đường dẫn của liên kết có khớp với đường dẫn hiện tại
        if (linkPath === currentPath) {
            link.classList.add("navbar__link--active"); // Thêm lớp active
        } else {
            link.classList.remove("navbar__link--active"); // Bỏ lớp active nếu không khớp
        }
    });
}

// Gọi hàm thiết lập lớp active cho navbar khi DOM được tải
document.addEventListener("DOMContentLoaded", function () {
    setActiveNavbarLink(); // Đặt liên kết active khi trang được tải
});
