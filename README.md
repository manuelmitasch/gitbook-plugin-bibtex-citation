Bibtex Citations Gitbook Plugin
==============

This plugins requires gitbook `>=2.0.0`.

### Install

Add this to your `book.json`, then run `gitbook install`:

```
{
    "plugins": ["bibtex-citation"]
}
```

### Usage

The plugin expects a `literature.bib` file in your books root folder.
You can use the bibtex keys defined within the file to reference the literature.

```
{{ "some-key" | cite }}
```

You can also add a table of references through:

```
{% references %} {% endreferences %}
```

Only used literature is included in the table of references. They are ordered by the usage within the text.


### Limitations

The plugin currently only supports IEEE referencing style.
Feel free to submit pull requests to add additional styles.

