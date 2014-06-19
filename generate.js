//
// My embarassingly simple blog generator. Pretty simple, doesn't do much;
// honestly, Jekyll is further ahead. But this isn't bound to one platform,
// and only requires static HTML hosting. And...because fun.
//

(function(){
    var fs = require('fs');

    //
    // Creates a 'teaser' from the post HTML, but instead of a simple substring,
    // obeys open/closed HTML tags so the teaser markup remains valid.
    //
    // Adapted from: http://blog.stevenlevithan.com/archives/get-html-summary
    //

    function getLeadingHtml (input, maxChars) {
        // token matches a word, tag, or special character
        var	token = /\w+|[^\w<]|<(\/)?(\w+)[^>]*(\/)?>|</g,
            selfClosingTag = /^(?:[hb]r|img)$/i,
            output = "",
            charCount = 0,
            openTags = [],
            match;

        // Set the default for the max number of characters
        // (only counts characters outside of HTML tags)
        maxChars = maxChars || 250;

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
    // Core file generation
    //

    // 1. Read header and footer
    console.log('Reading header and footer...');
    var header = fs.readFileSync('header.html');
    var footer = fs.readFileSync('footer.html');
    console.log('Done!!!');

    // 2. Enumerate all files in /posts
    console.log('Looking for posts...');
    var posts = fs.readdirSync('.\\posts');
    var index = [];

    // 2a. Make sure posts were found
    if (posts.length === 0){
        console.log('No posts found!!!');
    }

    // 2b. Walk each file found (what about ordering?)
    for (var j=0; j < posts.length; j++){
        console.log('Found ' + posts[j]);

        // kill the extension
        var name = posts[j].replace('.html', '');

        // split the filename into parts (break on '-')
        var parts = name.split('-');

        // The first 3 parts are YYYY-MM-DD; make directories for these
        var path = parts.shift();
        if (!fs.existsSync(path)){
            fs.mkdir(path);
        }

        path += '\\' + parts.shift();
        if (!fs.existsSync(path)){
            fs.mkdir(path);
        }

        path += '\\' + parts.shift();
        if (!fs.existsSync(path)){
            fs.mkdir(path);
        }

        // create a directory with the post name
        path += '\\' + parts.join('-');
        if (!fs.existsSync(path)){
            fs.mkdir(path);
        }

        // Read the post content, wrap with header/footer, and write out
        var content = fs.readFileSync('.\\posts\\' + posts[j]);
        path += '\\index.html';
        fs.writeFileSync(path, header + content + footer);

        // Create index data for teasers
        var teaser = {};
        teaser.content = getLeadingHtml(content.toString(), 350);
        teaser.link = path.replace('\\', '/').replace('index.html', '');

        // if the truncated content doesn't end with a closing 'div' tag, add it
        index.push(teaser);
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Index page generation
    //

    console.log('Creating index page(s)...');

    var indexContent = '<p class="noItems">No active posts!!!</p>';

    if (index.length > 0){
        // Create index page content
        indexContent = index.reduce(function(p, c){
            return p + c.content + '<p><a href="' + c.link + '" title="Read more...">Read more...</a></p>';
        }, '');
    }

    // write out index page
    fs.writeFileSync('.\\index.html', header + indexContent + footer);

    console.log('Done!!!');
    
    ///////////////////////////////////////////////////////////////////////////
    //
    // TODO: Need to update RSS template
    //
})();
