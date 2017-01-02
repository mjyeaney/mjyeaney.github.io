//
// My embarassingly simple blog generator. Pretty simple, doesn't do much;
// honestly, Jekyll is further ahead. But this isn't bound to one platform,
// and only requires static HTML hosting. And...because fun.
//

(function(){
    //
    // Module requirements
    //
    
    var fs = require('fs');
    var moment = require('moment');

    // 
    // Read in the basics for content generation
    //
    
    var header = fs.readFileSync('header.html');
    var footer = fs.readFileSync('footer.html');
    var index = [];

    // 
    // General message logging method; displays time, etc.
    //

    function logMessage(message){
        var msg = [];
        msg.push(moment().format('HH:mm:ss'));
        msg.push(': ');
        msg.push(message);
        console.log(msg.join(''));
    };

    //
    // Creates a 'teaser' from the post HTML, but instead of a simple substring,
    // obeys open/closed HTML tags so the teaser markup remains valid.
    //
    // Adapted from: http://blog.stevenlevithan.com/archives/get-html-summary
    //

    function getLeadingHtml (input) {
        // token matches a word, tag, or special character
        var	token = /\w+|[^\w<]|<(\/)?(\w+)[^>]*(\/)?>|</g,
            selfClosingTag = /^(?:[hb]r|img)$/i,
            output = "",
            charCount = 0,
            openTags = [],
            match;

        // Set the default for the max number of characters
        // (only counts characters outside of HTML tags)
        var maxChars = 500;

        while ((charCount < maxChars) && (match = token.exec(input))) {
            // If this is an HTML tag
            if (match[2]) {
                output += match[0];
                // If this is not a self-closing tag
                if (!(match[3] || selfClosingTag.test(match[2]))) {
                    // If this is a closing tag
                    if (match[1]) openTags.pop();
                    else openTags.push(match[2]);
                }
            } else {
                charCount += match[0].length;
                if (charCount <= maxChars) output += match[0];
            }
        }

        // Close any tags which were left open
        var i = openTags.length;
        while (i--) output += "</" + openTags[i] + ">";
        return output;
    };
    
    //
    // Core file generation. Read posts from staging area, and
    // create directory structures and index.html files for each.
    // Note that each post has a date field attached to it via attributes
    // contained within the markup (file system stamps are not enough!!!).
    //

    function publishPosts(){
        var posts = fs.readdirSync('./posts'),
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
                fs.mkdir(path);
            }
            
            path += '/' + parts.shift();
            dateText += path;
            if (!fs.existsSync(path)){
                logMessage('Creating ' + path + '...');
                fs.mkdir(path);
            }
            
            path += '/' + parts.shift();
            dateText += path;
            if (!fs.existsSync(path)){
                logMessage('Creating ' + path + '...');
                fs.mkdir(path);
            }

            // Now, create a directory with the post name
            path += '/' + parts.join('-');
            if (!fs.existsSync(path)){
                logMessage('Creating ' + path + '...');
                fs.mkdir(path);
            }

            // Read the post content, wrap with header/footer, and write out
            // as the index file.
            content = fs.readFileSync('./posts/' + p);
            path += '/index.html';
            logMessage('Creating ' + path + '...');
            fs.writeFileSync(path, header + content + footer);

            // Create index data for teasers
            teaser = {};
            teaser.dateText = dateText;
            teaser.content = getLeadingHtml(content.toString());

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

    function updateIndex(){
        // Initally, there are no posts.
        var indexContent = '<div class="post"><h2>Hmmm...somthing\'s Missing!!!</h2><p class="noItems">No active posts - please check back again later.</p></div>';

        logMessage('Creating index page(s)...');

        // However, if we find some....
        if (index.length > 0){
            // Create index page content by sorting by date first,
            // and then writing out the bits.
            //
            index.sort(function(a, b){
                if (a.dateText > b.dateText) return 1;
                else if (a.dateText < b.dateText) return -1;
                else return 0;
            });

            // Now, fold over the collection and write out teasers
            //
            indexContent = index.reduce(function(p, c){
                return p + 
                    c.content + 
                    '<p class="teaserLink"><a href="' + 
                    c.link + 
                    '" title="Read more">Read more...</a></p>';
            }, '');
        }

        // write out index page containing all teasers
        fs.writeFileSync('./index.html', header + indexContent + footer);
        logMessage('Done!');
    };
    
    //
    // Update RSS template with new information
    //
    function updateRssFeed(){
        // TODO:
    };
   
    // 
    // And this is all that's too it. Really.
    //
    publishPosts();
    updateIndex();
    updateRssFeed();
})();
