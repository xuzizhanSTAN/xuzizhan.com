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
    console.log('HTML文件数量:', htmlFiles.length);
    
    // 如果没有找到HTML文件，创建一个空的示例
    if (htmlFiles.length === 0) {
        console.log('没有找到HTML文件，创建一个空的示例文章列表');
        const emptyArticles = [{
            id: "example",
            title: "示例文章",
            date: "2023-01-01",
            summary: "这是一个示例文章，请在articles目录中添加.html文件",
            url: "articles/example.html"
        }];
        
        // 写入一个空示例JSON文件
        fs.writeFileSync(outputFile, JSON.stringify(emptyArticles, null, 2));
        console.log('创建了一个示例文章列表');
        console.log('检查文件是否已创建:', fs.existsSync(outputFile));
        return;
    }
    
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
    // 确保文件被写入到网站根目录（即public目录或项目根目录）
    const rootPath = path.join(__dirname, '../');
    fs.writeFileSync(path.join(rootPath, 'articles-list.json'), JSON.stringify(articles, null, 2));
    console.log(`已生成文章列表，保存到: ${path.join(rootPath, 'articles-list.json')}`);
}

// 执行扫描
scanArticles();

// 监视文件夹变化
if (process.argv.includes('--watch')) {
    console.log('监视文章文件夹变化...');
    fs.watch(articlesDir, { recursive: true }, (eventType, filename) => {
        if (filename) {
            console.log(`检测到文件变化: ${filename}`);
            scanArticles();
        }
    });
} 