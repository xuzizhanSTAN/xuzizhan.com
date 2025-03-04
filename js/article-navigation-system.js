/**
 * 文章导航系统 - 完整版
 * 这个脚本负责为所有文章页面自动生成导航链接
 * 它会根据文章在列表中的位置，生成"上一篇"、"下一篇"和"返回列表"链接
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取导航容器
    const navigationContainer = document.getElementById('article-navigation');
    if (!navigationContainer) {
        console.error('未找到导航容器，ID: article-navigation');
        return;
    }
    
    // 获取当前文章文件名
    const currentPath = window.location.pathname;
    const currentFileName = currentPath.split('/').pop();
    
    console.log('文章导航系统初始化，当前文件名:', currentFileName);
    
    // 添加加载指示器
    navigationContainer.innerHTML = '<div class="loading">加载导航...</div>';
    
    // 获取文章列表
    fetch('../articles-list.json?' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error('无法获取文章列表');
            }
            return response.json();
        })
        .then(articles => {
            console.log('获取到文章列表，文章数量:', articles.length);
            
            // 过滤掉模板文件
            articles = articles.filter(article => !article.id.includes('template'));
            
            // 按日期排序（从新到旧）
            articles.sort((a, b) => {
                // 尝试解析日期
                let dateA, dateB;
                try {
                    dateA = new Date(a.date.replace(/年|月|日/g, '-'));
                    dateB = new Date(b.date.replace(/年|月|日/g, '-'));
                    
                    // 检查日期是否有效
                    if (isNaN(dateA.getTime())) throw new Error('Invalid date A');
                    if (isNaN(dateB.getTime())) throw new Error('Invalid date B');
                    
                    return dateB - dateA;
                } catch (e) {
                    console.error('日期解析错误:', e);
                    // 如果日期解析失败，使用标题字母顺序排序
                    return a.title.localeCompare(b.title);
                }
            });
            
            // 创建文件名到索引的映射
            const fileNameToIndex = {};
            articles.forEach((article, index) => {
                // 提取文件名
                const fileName = article.url.split('/').pop();
                fileNameToIndex[fileName] = index;
                console.log(`文件名映射: ${fileName} -> ${index}`);
            });
            
            // 找到当前文章在列表中的位置
            const currentIndex = fileNameToIndex[currentFileName];
            
            if (currentIndex === undefined) {
                console.error('当前文章未在列表中找到:', currentFileName);
                navigationContainer.innerHTML = `
                    <div class="error">无法生成导航 - 文章未找到</div>
                    <a href="../index.html#share" class="btn list-btn">返回文章列表</a>
                `;
                return;
            }
            
            console.log('当前文章索引:', currentIndex, '总文章数:', articles.length);
            
            // 生成导航链接
            generateNavigation(navigationContainer, articles, currentIndex);
        })
        .catch(error => {
            console.error('加载文章列表失败:', error);
            navigationContainer.innerHTML = `
                <div class="error">加载导航失败: ${error.message}</div>
                <a href="../index.html#share" class="btn list-btn">返回文章列表</a>
            `;
        });
    
    /**
     * 生成导航链接
     * @param {HTMLElement} container - 导航容器元素
     * @param {Array} articles - 文章列表
     * @param {Number} currentIndex - 当前文章在列表中的索引
     */
    function generateNavigation(container, articles, currentIndex) {
        // 清空容器
        container.innerHTML = '';
        
        // 创建导航HTML
        let navHTML = '';
        
        // 检查文章数量
        if (articles.length <= 1) {
            // 只有一篇文章，只显示返回列表
            navHTML = `<a href="../index.html#share" class="btn list-btn">返回文章列表</a>`;
            container.innerHTML = navHTML;
            container.style.display = 'flex';
            container.style.justifyContent = 'center';
            return;
        }
        
        // 最新文章（第一篇）：显示"下一篇"和"返回列表"
        if (currentIndex === 0) {
            console.log('处理最新文章导航');
            
            // 下一篇（较旧的文章）
            const olderArticle = articles[1];
            
            // 构建URL - 使用简单直接的方法
            const nextUrl = '../' + olderArticle.url;
            
            navHTML += `<a href="${nextUrl}" class="btn next-btn">下一篇：${olderArticle.title}</a>`;
            navHTML += `<a href="../index.html#share" class="btn list-btn">返回文章列表</a>`;
        }
        // 最旧文章（最后一篇）：显示"上一篇"和"返回列表"
        else if (currentIndex === articles.length - 1) {
            console.log('处理最旧文章导航');
            
            // 上一篇（较新的文章）
            const newerArticle = articles[currentIndex - 1];
            
            // 构建URL - 使用简单直接的方法
            const prevUrl = '../' + newerArticle.url;
            
            navHTML += `<a href="${prevUrl}" class="btn back-btn">上一篇：${newerArticle.title}</a>`;
            navHTML += `<a href="../index.html#share" class="btn list-btn">返回文章列表</a>`;
        }
        // 中间文章：显示"上一篇"、"下一篇"和"返回列表"
        else {
            console.log('处理中间文章导航');
            
            // 上一篇（较新的文章）
            const newerArticle = articles[currentIndex - 1];
            
            // 下一篇（较旧的文章）
            const olderArticle = articles[currentIndex + 1];
            
            // 构建URL - 使用简单直接的方法
            const prevUrl = '../' + newerArticle.url;
            const nextUrl = '../' + olderArticle.url;
            
            navHTML += `<a href="${prevUrl}" class="btn back-btn">上一篇：${newerArticle.title}</a>`;
            navHTML += `<a href="../index.html#share" class="btn list-btn">返回文章列表</a>`;
            navHTML += `<a href="${nextUrl}" class="btn next-btn">下一篇：${olderArticle.title}</a>`;
        }
        
        // 设置导航HTML
        container.innerHTML = navHTML;
        console.log('导航HTML已设置');
        
        // 根据按钮数量调整样式
        const buttons = container.querySelectorAll('.btn');
        console.log('导航按钮数量:', buttons.length);
        
        if (buttons.length === 1) {
            // 只有一个按钮时居中显示
            container.style.display = 'flex';
            container.style.justifyContent = 'center';
        } else if (buttons.length === 2) {
            // 两个按钮时使用space-between布局
            container.style.display = 'flex';
            container.style.justifyContent = 'space-between';
        } else if (buttons.length === 3) {
            // 三个按钮时使用grid布局
            container.classList.add('three-buttons');
        }
    }
}); 