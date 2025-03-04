const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 文章文件夹路径
const articlesDir = path.join(__dirname, '../articles');
// 输出JSON文件路径
const outputFile = path.join(__dirname, '../articles-list.json');

// 扫描文章文件夹
function scanArticles() {
    console.log('扫描文章文件夹...');
    const articles = [];
    
    // 读取文件夹中的所有文件
    const files = fs.readdirSync(articlesDir);
    
    // 过滤出HTML文件
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    // 处理每个HTML文件
    htmlFiles.forEach(file => {
        const filePath = path.join(articlesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // 使用cheerio解析HTML
        const $ = cheerio.load(fileContent);
        
        // 提取文章信息
        const title = $('h1').text().trim();
        const date = $('.article-date').text().trim();
        const summary = $('.article-body p').first().text().trim();
        
        // 生成文章ID
        const id = path.basename(file, '.html');
        
        // 添加到文章列表
        articles.push({
            id,
            title,
            date,
            summary: summary.length > 100 ? summary.substring(0, 100) + '...' : summary,
            url: `articles/${file}`
        });
    });
    
    // 按日期排序（从新到旧）
    articles.sort((a, b) => {
        const dateA = new Date(a.date.replace(/年|月|日/g, '-'));
        const dateB = new Date(b.date.replace(/年|月|日/g, '-'));
        return dateB - dateA;
    });
    
    // 写入JSON文件
    fs.writeFileSync(outputFile, JSON.stringify(articles, null, 4), 'utf8');
    console.log(`已生成文章列表，共 ${articles.length} 篇文章`);
}

// 执行扫描
scanArticles();

// 监视文件夹变化
if (process.argv.includes('--watch')) {
    console.log('监视文章文件夹变化...');
    fs.watch(articlesDir, (eventType, filename) => {
        if (filename && filename.endsWith('.html')) {
            console.log(`检测到文件变化: ${filename}`);
            scanArticles();
        }
    });
} 