/*
 * gui-builder - A simple WYSIWYG HTML5 app creator
 * Copyright (c) 2011, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
"use strict";

// Palette view widget


(function($, undefined) {

    $.widget('gb.paletteView', {

        options: {
            model: null,
        },

        _create: function() {
            var o = this.options,
                e = this.element;


            this.refresh(null, this);

            return this;
        },

        _setOption: function(key, value) {
            switch (key) {
                case 'model':
                    this.options.model = value;
                    this.refresh(null, this);
                    break;
                default:
                    break;
            }
        },

        destroy: function() {
            // TODO: unbind any ADM event handlers
            $(this.element).find('.'+this.widgetName).remove();
            this.options.primaryTools.remove();
            this.options.secondaryTools.remove();
        },

        refresh: function(event, widget) {
            var listWidgets = function (container, group) {
                    $.each(group, function (name, value) {
                        if (value && value.icon){
                            var li = $('<div id="BWidget-'+name+'"></div>').appendTo(container);
                            $(li).button({
                                label: BWidget.getDisplayLabel(name),
                                icons: {primary: BWidget.getIcon(name)}
                            });
                            $(li).disableSelection();
                            $(li).addClass('nrc-palette-widget');
                            $(li).data("code", BWidget.getTemplate(name));
                            $(li).data("adm-node", {type: name});
                        }
                        else if (value)
                            listWidgets(container, value);
                    });
                };
            widget = widget || this;
            if (widget.options && widget.options.model) {
                this.element.empty();
                listWidgets((this.element), this.options.model);
                var w = this.element.find('.nrc-palette-widget');

                w.draggable({
                    revert: false,
                    appendTo: 'body',
                    iframeFix: true,
                    containment: false,
                    connectToSortable: $(':gb-layoutView').layoutView('option', 'contentDocument').find('.nrc-sortable-container'),
                    helper: 'clone',
                    refreshPositions: true,
                    stack: '.layoutView iframe',
                    revertDuration: 0,
                    start: function(event,ui){
                        if (ui.helper) {
                            if (ui.helper[0].id == "") {
                                ui.helper[0].id = this.id+'-helper';
                            }
                        }
                    },
                })
                .disableSelection();
            }
        },
        resize: function(event, widget) {
            this.element.height(this.element.parent().height() -
                    this.element.prev().height());
        },

    });
})(jQuery);
