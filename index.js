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
            var citation = _.find(this.book.bib, {'citationKey': key.toUpperCase()});

            if (citation != undefined) {
                if (!citation.used) {
                    citation.used = true;
                    this.book.bibCount++;
                    citation.number = this.book.bibCount;
                }
                return '[' + citation.number + ']';
            } else {
                return "[Citation not found]";
            }
        }
    },

    hooks: {
        init: function() {
            var bib = fs.readFileSync(this.root + '/literature.bib', 'utf8');
            this.bib = bibtexParse.toJSON(bib);
            this.bibCount = 0;
        }
    },

    blocks: {
        references: {
            process: function(blk) {
                var usedBib = _.filter(this.book.bib, 'used');
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
