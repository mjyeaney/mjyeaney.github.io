//
// Embarassingly simple blog generator. Pretty simple, doesn't do much, 
// isn't bound to one platform, and only requires static HTML hosting. 
// And mostly...because fun.
//

(() => {
    //
    // Module requirements
    //
    const fs = require('fs'),
        moment = require('moment'),
        cheerio = require('cheerio');

    // 
    // Read in the chunks used for content generation
    //
    const header = fs.readFileSync('header.html'),
        footer = fs.readFileSync('footer.html'),
        disqus = fs.readFileSync('disqus.html');
    
    // Page metadata dict
    let index = [];

    // 
    // General message logging method; displays time, etc.
    //
    let logMessage = (message) => {
        let msg = [];
        msg.push(moment().format('HH:mm:ss'));
        msg.push(': ');
        msg.push(message);
        console.log(msg.join(''));
    };

    //
    // Gets summary information from the post markup, including the tags,
    // teaser information, and post date.
    //
    let getSummaryInformation = (input) => {
        // Load / parse content
        let $ = cheerio.load(input);

        // Get title, tag, teaser, and date information
        let title = $('div.post .title').html(),
            tags = $('div.post').data('tags').split(','),
            teaser = $('div.post .teaser').html(),
            postDate = $('div.post').data('date'),
            authorInfo = $('div.authorInfo').html();

        // Package up and return
        return {
            title: title,
            tags: tags,
            intro: teaser,
            authorInfo: authorInfo,
            dateText: postDate
        };
    };
    
    //
    // Core file generation. Read posts from staging area, and
    // create directory structures and index.html files for each.
    // Note that each post has a date field attached to it via attributes
    // contained within the markup (file system stamps are not enough!!!).
    //
    let publishPosts = () => {
        let posts = fs.readdirSync('./posts'),
            j = 0,
            name = '',
            parts = [],
            path = '',
            content = null,
            teaser = null,
            dateText = '';

        // Enumerate all files in /posts
        logMessage('Looking for posts...');

        // Make sure posts were found
        if (posts.length === 0){
            logMessage('No posts found!');
            return;
        }

        // Walk each file found (what about ordering?)
        posts.map(function(p){
            logMessage('Found ' + p);

            // kill the extension
            name = p.replace('.html', '').toLowerCase();

            // split the filename into parts (break on '-')
            parts = name.split('-');

            // The first 3 parts are YYYY-MM-DD; make directories for these
            path = parts.shift();
            dateText += path;
            if (!fs.existsSync(path)){
                logMessage('Creating ' + path + '...');
                fs.mkdirSync(path);
            }
            
            path += '/' + parts.shift();
            dateText += path;
            if (!fs.existsSync(path)){
                logMessage('Creating ' + path + '...');
                fs.mkdirSync(path);
            }
            
            path += '/' + parts.shift();
            dateText += path;
            if (!fs.existsSync(path)){
                logMessage('Creating ' + path + '...');
                fs.mkdirSync(path);
            }

            // Now, create a directory with the post name
            path += '/' + parts.join('-');
            if (!fs.existsSync(path)){
                logMessage('Creating ' + path + '...');
                fs.mkdirSync(path);
            }

            // Read the post content, wrap with header/footer, and write out
            // as the index file.
            content = fs.readFileSync('./posts/' + p);
            path += '/index.html';
            logMessage('Creating ' + path + '...');

            // Create index data for teasers
            teaser = getSummaryInformation(content.toString());
            
            // Write out the chunk of content
            let thisHeader = header.toString().replace('${title}', teaser.title + " - ");
            fs.writeFileSync(path, thisHeader + content + disqus + footer);

            // This may not be needed anymore - keep an eye on it.
            teaser.link = path.replace('\\', '/').replace('index.html', '');

            // Add the teaser structure to our master collection for later.
            index.push(teaser);
        });
    };

    //
    // Index page generation...reads through posts, generates teasers, organizes 
    // based on date, and creates pages (iif needed).
    //
    let updateIndex = () => {
        // Initally, there are no posts.
        let indexContent = `
            <div class="post">
                <h2>Something\'s missing...</h2>
                <p class="noItems">No active posts - please check back again later.</p>
            </div>
        `;

        logMessage('Creating index page(s)...');

        if (index.length > 0){
            // Create index page content by sorting by date (newest first)
            //
            index.sort(function(a, b){
                if (a.dateText > b.dateText) return -1;
                else if (a.dateText < b.dateText) return 1;
                else return 0;
            });

            // Now, fold over the collection and write out teasers
            //
            indexContent = index.reduce(function(p, c){
                return p + 
                    `<div class="post frontPage">
                        <h2><a href="${c.link}" title="Read more">${c.title}</a></h2>
                        <p>${c.intro}</p>
                        <div class="authorInfo">${c.authorInfo}</div>
                    </div>`;
            }, '');
        }

        // write out index page containing all teasers
        let indexHeader = header.toString().replace('${title}', '');
        fs.writeFileSync('./index.html', indexHeader + indexContent + footer);
        logMessage('Done!');
    };
   
    // 
    // And this is all that's too it. Really.
    //
    publishPosts();
    updateIndex();
})();
