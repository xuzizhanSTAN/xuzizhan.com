// 文章导航系统 - 专门处理文章之间的导航
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前文章的URL路径
    const currentPath = window.location.pathname;
    const currentArticleId = currentPath.split('/').pop().replace('.html', '');
    
    // 获取导航容器
    const articleNav = document.querySelector('.article-nav');
    if (!articleNav) {
        console.error('未找到导航容器 .article-nav');
        return;
    }
    
    console.log('开始处理文章导航，当前文章ID:', currentArticleId);
    
    // 添加时间戳参数，防止浏览器缓存
    const timestamp = new Date().getTime();
    
    // 从JSON文件加载文章列表
    fetch(`../articles-list.json?t=${timestamp}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`无法获取文章列表: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(articles => {
            console.log('成功获取文章列表，文章数量:', articles.length);
            
            // 过滤掉模板文章
            articles = articles.filter(article => !article.id.includes('template'));
            console.log('过滤后的文章数量:', articles.length);
            
            if (!articles || articles.length === 0) {
                console.error('文章列表为空');
                return;
            }
            
            // 按日期排序（从新到旧）
            articles.sort((a, b) => {
                const dateA = new Date(a.date.replace(/年|月|日/g, '-'));
                const dateB = new Date(b.date.replace(/年|月|日/g, '-'));
                return dateB - dateA;
            });
            
            // 找到当前文章在列表中的位置
            const currentIndex = articles.findIndex(article => 
                article.id === currentArticleId || 
                article.url.includes(currentArticleId)
            );
            
            if (currentIndex === -1) {
                console.error('当前文章未在列表中找到:', currentArticleId);
                return;
            }
            
            console.log('当前文章索引:', currentIndex, '总文章数:', articles.length);
            
            // 设置导航
            setupNavigation(articles, currentIndex);
        })
        .catch(error => {
            console.error('加载文章列表失败:', error);
        });
    
    // 设置导航
    function setupNavigation(articles, currentIndex) {
        // 清空现有导航
        articleNav.innerHTML = '';
        
        // 创建导航HTML
        let navHTML = '';
        
        // 最新文章（第一篇）：显示"下一篇"和"返回列表"
        if (currentIndex === 0) {
            console.log('处理最新文章导航');
            // 下一篇（较旧的文章）
            if (articles.length > 1) {
                const olderArticle = articles[1];
                // 修复链接路径，确保以../开头
                const articleUrl = olderArticle.url.startsWith('../') ? 
                    olderArticle.url : `../${olderArticle.url}`;
                navHTML += `<a href="${articleUrl}" class="btn next-btn">下一篇：${olderArticle.title}</a>`;
            }
            
            // 返回列表
            navHTML += `<a href="../index.html#share" class="btn list-btn">返回文章列表</a>`;
        }
        // 最旧文章（最后一篇）：显示"上一篇"和"返回列表"
        else if (currentIndex === articles.length - 1) {
            console.log('处理最旧文章导航');
            // 上一篇（较新的文章）
            const newerArticle = articles[currentIndex - 1];
            // 修复链接路径，确保以../开头
            const articleUrl = newerArticle.url.startsWith('../') ? 
                newerArticle.url : `../${newerArticle.url}`;
            navHTML += `<a href="${articleUrl}" class="btn back-btn">上一篇：${newerArticle.title}</a>`;
            
            // 返回列表
            navHTML += `<a href="../index.html#share" class="btn list-btn">返回文章列表</a>`;
        }
        // 中间文章：显示"上一篇"、"下一篇"和"返回列表"
        else {
            console.log('处理中间文章导航');
            // 上一篇（较新的文章）
            const newerArticle = articles[currentIndex - 1];
            // 修复链接路径，确保以../开头
            const newerUrl = newerArticle.url.startsWith('../') ? 
                newerArticle.url : `../${newerArticle.url}`;
            navHTML += `<a href="${newerUrl}" class="btn back-btn">上一篇：${newerArticle.title}</a>`;
            
            // 返回列表
            navHTML += `<a href="../index.html#share" class="btn list-btn">返回文章列表</a>`;
            
            // 下一篇（较旧的文章）
            const olderArticle = articles[currentIndex + 1];
            // 修复链接路径，确保以../开头
            const olderUrl = olderArticle.url.startsWith('../') ? 
                olderArticle.url : `../${olderArticle.url}`;
            navHTML += `<a href="${olderUrl}" class="btn next-btn">下一篇：${olderArticle.title}</a>`;
        }
        
        // 设置导航HTML
        articleNav.innerHTML = navHTML;
        console.log('导航HTML已设置:', navHTML);
        
        // 根据按钮数量调整样式
        const buttons = articleNav.querySelectorAll('.btn');
        console.log('导航按钮数量:', buttons.length);
        
        if (buttons.length === 2) {
            // 两个按钮时使用space-between布局
            articleNav.style.display = 'flex';
            articleNav.style.justifyContent = 'space-between';
        } else if (buttons.length === 3) {
            // 三个按钮时使用grid布局
            articleNav.style.display = 'grid';
            articleNav.style.gridTemplateColumns = '1fr auto 1fr';
            articleNav.style.gap = '10px';
            
            // 设置按钮样式
            buttons[0].style.justifySelf = 'start'; // 上一篇靠左
            buttons[1].style.justifySelf = 'center'; // 返回列表居中
            buttons[2].style.justifySelf = 'end'; // 下一篇靠右
        }
    }
}); 