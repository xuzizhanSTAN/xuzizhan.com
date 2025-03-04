// 文章加载器 - 动态从articles文件夹加载文章并显示在主页上
document.addEventListener('DOMContentLoaded', function() {
    // 获取文章容器
    const articlesGrid = document.querySelector('.articles-grid');
    if (!articlesGrid) return;
    
    // 从JSON文件加载文章列表
    fetch('articles-list.json')
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('无法获取文章列表');
        })
        .then(articles => {
            // 清空现有内容
            articlesGrid.innerHTML = '';
            
            if (articles.length === 0) {
                articlesGrid.innerHTML = '<p>暂无文章</p>';
                return;
            }
            
            // 遍历文章数据并创建文章项
            articles.forEach(article => {
                const articleItem = document.createElement('div');
                articleItem.className = 'article-item';
                
                articleItem.innerHTML = `
                    <div class="article-date">${article.date}</div>
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                    <a href="${article.url}" class="btn">阅读全文</a>
                `;
                
                articlesGrid.appendChild(articleItem);
            });
        })
        .catch(error => {
            console.error('加载文章列表失败:', error);
            articlesGrid.innerHTML = '<p>加载文章列表失败</p>';
        });
}); 