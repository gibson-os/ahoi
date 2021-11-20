var jsonCMS = {
    language: 'de',
    path: '/',
    layout: null,
    navigation: null,
    navigations: [],
    currentNodes: [],
    contentItem: null,
    setPath: function(path) {
        this.path = path;
    },
    setLanguage: function(language) {
        this.language = language;
    },
    loadLayout: function(options) {
        var cms = this;

        $.getJSON(cms.path + 'json/layout.json', function(data) {
            cms.layout = data;
            cms.loadNavigation();

            $.each(data.navigations, function(key, value) {
                cms.setNavigation(value);
            });

            if (data.content) {
                cms.setContent(data.content);
            }

            var locationHref = location.href.split('#');

            if (
                locationHref.length == 2 &&
                locationHref[1].indexOf('/') == 0
            ) {
                cms.loadContent({url: locationHref[1].substr(1)});
            } else {
                cms.setElementFunctions();
            }

            if (
                options &&
                typeof(options.success) == 'function'
            ) {
                options.success(data);
            }
        });
    },
    setElementFunctions: function() {
        var cms = this;
        var url = cms.layout.url + '/' + cms.currentNodes.join('/');

        $("a[rel^='prettyPhoto']").prettyPhoto();
        $('.contentLink').click(function() {
            var link = this.href.split('/');
            var path = '';

            for (var i = 3; i < link.length; i++) {
                path += '/' + link[i];
            }

            path = path.substr(1);
            path = path.split('.');
            path = path[0];

            cms.loadContent({url: path});

            return false;
        });
        /*$('.fb-like').attr('data-href', cms.layout.url + '/' + cms.currentNodes.join('/'));

        if (cms.currentNodes) {
            $('link[rel=canonical]').href = url;
            $('link[rel=canonical]').attr('href', url);
        }

        $('.gplus').children().remove();
        $('.gplus').add('<div class="g-plusone" data-size="tall" href="' + url + '"></div>').appendTo('.gplus');
        gapi.plusone.go();*/
    },
    loadNavigation: function(options) {
        var cms = this;

        $.getJSON(cms.path + 'json/navigation.json', function(data) {
            cms.navigation = data;

            if (
                options &&
                typeof(options.success) == 'function'
            ) {
                options.success(data);
            }
        });
    },
    setNavigation: function(options) {
        options.currentDepth = 1;
        this.navigations.push(options);
    },
    renderNavigation: function(options) {
        var cms = this;

        if (!options.depth) {
            options.depth = 0;
        }

        if (!this.navigation) {
            this.loadNavigation({
                success: function(data) {
                    cms.setNavigation(options);
                }
            });
            return true;
        }

        $('#' + options.itemId).html(cms.setNavigationLevel(options));
        return true;
    },
    setNavigationLevel: function(options) {
        var cms = this;
        var navigation = cms.navigation;
        var items = [];
        var nodes = [];

        if (!options.startDepth) {
            options.startDepth = 0;
        }

        if (cms.currentNodes.length < options.startDepth) {
            return '';
        } else if (options.startDepth) {
            for (var i = 0; i < options.startDepth; i++) {
                nodes.push(cms.currentNodes[i]);
            }
        } else if (options.nodes) {
            nodes = options.nodes;
        }

        if (nodes) {
            $.each(nodes, function(key, node) {
                $.each(navigation, function(key, item) {
                    if (item['node'] == node) {
                        navigation = item.items;
                        return true;
                    }
                });
            });
        }

        if (!navigation) {
            return '';
        }

        $.each(navigation, function(key, value) {
            var className = '';
            var itemNodes = nodes.slice();
            itemNodes.push(value.node);

            if (value.node == cms.currentNodes[itemNodes.length-1]) {
                className += ' active';
            }

            var html = '<li class="' + className + '"><a href="/' + itemNodes.join('/') + '.html" '
                     + 'class="contentLink ' + className + '">'
                     + value.name[cms.language] + '</a>';

            if (
                value.items &&
                (
                    options.depth == 0 ||
                    options.currentDepth < options.depth
                )
            ) {
                html += cms.setNavigationLevel({
                    navigation: value.items,
                    nodes: itemNodes,
                    currentDepth: options.currentDepth+1,
                    depth: options.depth
                });
            }

            items.push(html + '</li>');
        });

        return '<ul>' + items.join('') + '</ul>';
    },
    setContent: function(options) {
        this.contentItem = options.itemId;
    },
    loadContent: function(options) {
        var cms = this;
        var url = 'index';

        if (options.url) {
            url = options.url;
        }

        $.getJSON(cms.path + 'json/content/' + url + '.json', function(data) {
            var locationHref = location.href.split('#')[0];
            location.href = locationHref + '#/' + url;

            var partials = data.html.match(/\{\{.+?\}\}/g);

            if (partials) {
                $.each(partials, function(key, partial) {
                    var tmpPartial = partial;

                    tmpPartial = tmpPartial.replace(/\{\{/, '');
                    tmpPartial = tmpPartial.replace(/\}\}/, '');
                    tmpPartial = tmpPartial.split('=');
                    var partialTemplate = cms.layout.partials[tmpPartial[0]];

                    if (tmpPartial.length > 1) {
                        var tmpData = [tmpPartial[1]];

                        if (tmpPartial.length > 2) {
                            for (var i = 2; i < tmpPartial.length; i++) {
                                tmpData.push('=' + tmpPartial[i]);
                            }
                        }

                        var values = JSON.parse('{' + tmpData.join('') + '}');

                        $.each(values, function(name, value) {
                            var regEx = new RegExp(cms.escapeRegExp('{{' + name + '}}'), 'g');
                            partialTemplate = partialTemplate.replace(regEx, value);
                        });
                    }

                    partialTemplate = partialTemplate.replace(/\{\{.+?\}\}/g, '');

                    var regEx = new RegExp(cms.escapeRegExp(partial));
                    data.html = data.html.replace(regEx, partialTemplate);
                });
            }

            data.html = data.html.replace(/\{\{.+?\}\}/g, '');
            $('#' + cms.contentItem).html(data.html);

            if (url == 'index') {
                cms.currentNodes = [];
            } else {
                cms.currentNodes = url.split('/');
            }

            $.each(cms.navigations, function(key, navigation) {
                cms.renderNavigation(navigation);
            });

            if (data.title) {
                document.title = data.title + ' - ' + cms.layout.title;
            } else {
                document.title = cms.layout.title;
            }

            cms.setElementFunctions();
        });

        return false;
    },
    escapeRegExp: function(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
};

$(document).ready(function(){
    jsonCMS.loadLayout();
});