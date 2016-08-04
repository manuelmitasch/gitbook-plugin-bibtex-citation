var bibtexParse = require('bibtex-parser-js');
var _ = require('lodash');
var fs = require('fs');

module.exports = {
    book: {
        assets: './assets',
        css: [
            "style.css"
        ]
    },

    filters: {
        cite: function(key) {
            bib = this.config.get("bib")
            bibCount = this.config.get("bibCount") + 1
            var citation = _.find(bib, {'citationKey': key.toUpperCase()});

            if (citation != undefined) {
                if (!citation.used) {
                    citation.used = true;
                    this.config.set("bibCount",bibCount)
                    citation.number = bibCount;
                }
                return '[' + citation.number + ']';
            } else {
                return "[Citation not found]";
            }
        }
    },

    hooks: {
        init: function() {
            var bib = fs.readFileSync('./literature.bib', 'utf8')
            this.config.set("bib",bibtexParse.toJSON(bib))
            this.config.set("bibCount", 0)
            console.log(this.book.config)
        }
    },

    blocks: {
        references: {
            process: function(blk) {
                var usedBib = _.filter(this.config.get("bib"), 'used');
                var sortedBib = _.sortBy(usedBib, 'number');

                var result = '<table class="references">';

                sortedBib.forEach(function(item) {
                    result += '<tr><td>[' + item.number + ']</td><td>';

                    if (item.entryTags.AUTHOR) {
                        result += formatAuthors(item.entryTags.AUTHOR) + ', ';
                    }
                    if (item.entryTags.TITLE) {
                        result += item.entryTags.TITLE + ', ';
                    }
                    if (item.entryTags.BOOKTITLE) {
                        result += '<i>' + item.entryTags.BOOKTITLE + '</i>, '
                    }
                    if (item.entryTags.PUBLISHER) {
                        result += '<i>' + item.entryTags.PUBLISHER + '</i>, '
                    }
                    if (item.entryTags.YEAR) {
                        result += item.entryTags.YEAR + '.';
                    }

                    result += '</td></tr>';
                });

                result += '</table>';

                return result;
            }
        }
    }
};



function formatAuthors (authorsString) {
    var authors = authorsString.split('and');

    if (authors.length > 3) {
        return authors[0] + ' <i>et al.</i>';
    } else {
        return authorsString;
    }
}
