define([
    'scalejs!core',
    'jquery',
    'knockout',
    'text!./views/accordion.html'
], function (
    core,
    $,
    ko
) {
    'use strict';

    var get = core.object.get,
        merge = core.object.merge;

    function applyAccordion(element, openPanel) {
        var initPanel = ko.unwrap(openPanel);

        $(element).find('> div').show();
        $(element).find('> div').slideToggle(0);
        if (initPanel) {
            var pane = $(element).find('> h3').eq(initPanel - 1).addClass('current');

            if (!pane.hasClass('sj_accordion_disabled')) {
                pane = pane.next('.pane').slideToggle(0);
            } else {
                pane = pane.next('.pane');
            }
            pane.siblings('.pane:visible').slideUp(0);
            //pane.children("*").css('display','block');
        }
        $(element).find('> h3').each(function (i) {
            if (!$(this).hasClass('sj_accordion_disabled') && !$(this).hasClass('navDisabled')) { //todo use attr
                $(this).click(function () {
                    var pane = $(this).next('.pane');

                   // pane.children("*").css('display', 'block');

                    pane.slideToggle('fast').siblings('.pane:visible').slideUp('fast');
                    $(this).toggleClass('current');
                    $(this).siblings('h3').removeClass('current');
                    if (ko.isObservable(openPanel)) {
                        openPanel(i + 1);
                    }
                });
            } else if (!$(this).hasClass('navDisabled')) {
                $(this).click(function () {
                    $(this).addClass('current');
                    $(this).siblings('h3').removeClass('current');
                    $(this).siblings('.pane:visible').slideUp('fast');
                });
            } else {
                $(this).css('cursor', 'default');
            }
        });

        if(ko.isObservable(openPanel)) {
            openPanel.subscribe(function(openedPanel) {
                var $panel = $(element).find('h3').eq(openedPanel - 1);
                if (!$panel.hasClass('current')) {

                    if (!$panel.hasClass('sj_accordion_disabled')) {
                        var pane = $panel.next('.pane');
                        pane.slideToggle('fast').siblings('.pane:visible').slideUp('fast');
                        $panel.toggleClass('current');
                        $panel.siblings('h3').removeClass('current');
                    } else {
                        $panel.addClass('current');
                        $panel.siblings('h3').removeClass('current');
                        $panel.siblings('.pane:visible').slideUp('fast');
                    }
                }
            });
        }
    }

    function wrapValueAccessor(element, valueAccessor) {
        var options = valueAccessor(),
            itemsSource = ko.unwrap(options.itemsSource),
            headerPath = options.headerPath || 'header.data',
            contentPath = options.contentPath || 'content.data',
            headerCssPath = options.headerCssPath || 'header.css',
            headerClickPath = options.headerClickPath || 'header.click',
            mappedItemsSource;

        mappedItemsSource = itemsSource.map(function (item) {
            return {
                header: {
                    template: get(item, 'header.template', options.headerTemplate || 'sj_accordion_header_template'),
                    data: get(item, headerPath, item.header),
                    click: get(item, headerClickPath, item.click) || function () {},
                    css: merge(get(item, headerCssPath, item.css) || {}, { 'sj_accordion_disabled': item.disabled })
                },
                content: {
                    template: get(item, 'content.template', options.contentTemplate || 'sj_accordion_content_template'),
                    data: get(item, contentPath, item.content) || item
                }
            };
        });

        return function () {
            return {
                name: 'sj_accordion_template',
                foreach: mappedItemsSource,
                afterRender: function (e, o) {
                    if (o === mappedItemsSource[mappedItemsSource.length -1]) {
                        applyAccordion(element, options.openPanel);
                    }
                }
            };
        }
    }

    function init() {
        return { controlsDescendantBindings: true };
    }

    function update(
        element,
        valueAccessor,
        allBindingsAccessor,
        viewModel,
        bindingContext
    ) {

        ko.bindingHandlers.template.update(
            element,
            wrapValueAccessor(element, valueAccessor),
            allBindingsAccessor,
            viewModel,
            bindingContext
        );

        return { controlsDescendantBindings: true };
    }

    ko.bindingHandlers.accordion = {
        init: init,
        update: update
    };

});
