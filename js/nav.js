document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    // 汉堡菜单点击事件
    burger.addEventListener('click', () => {
        // 切换导航菜单
        nav.classList.toggle('nav-active');
        
        // 导航链接动画
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // 汉堡菜单动画
        burger.classList.toggle('toggle');
    });
}); 