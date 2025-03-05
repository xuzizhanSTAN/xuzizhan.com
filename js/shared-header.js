// 示例代码
document.addEventListener('DOMContentLoaded', function() {
    fetch('../components/header-template.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
        });
}); 