(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.gaffa-radio = factory();
    }
}(this, function(){
    var gaffa = window.gaffa,
        viewType = "radio";

    function Radio(){}
    Radio = gaffa.createSpec(Radio, gaffa.View);
    Radio.prototype.type = viewType;
    Radio.prototype.render = function() {
        var classes = viewType,
            viewModel = this,
            renderedElement = document.createElement('div');

        renderedElement.className = classes;
        
        $(renderedElement).bind(this.updateEventName || "change", function () {
            window.gaffa.model.set(viewModel.value.binding, $(this).find(':checked').val(), viewModel);
        });

        this.renderedElement = renderedElement;
        
        this.__super__.render.apply(this, arguments);
    }
    
    function updateOptions(viewModel, value) {
        var property = this
            element = $(viewModel.renderedElement),
            groupName = viewModel.groupName.value;

        if (!Array.isArray(value)) {
            value = [];
        }

        if (element) {
            element.empty();
            for (var i = 0; i < value.length; i++) {
                var optionData = value[i];
                if (optionData !== undefined) {
                    var option = document.createElement('input'),
                        label = document.createElement('label'),
                        container = document.createElement('div'),
                        currentValue = gaffa.utils.getProp(value, i + gaffa.pathSeparator + property.valuePath);

                    option.setAttribute('type', 'radio');
                    option.setAttribute('name', groupName);

                    option.setAttribute('value', currentValue);
                    option.setAttribute('id', groupName + currentValue);
                    label.innerHTML = gaffa.utils.getProp(value, i + gaffa.pathSeparator + property.textPath);
                    label.setAttribute('for', groupName + currentValue);

                    element.append($(container).append(option, label));
                }
            }
        }
    }

    Radio.prototype.groupName = new gaffa.Property(updateOptions);
    
    Radio.prototype.options = new gaffa.Property(updateOptions);
    
    Radio.prototype.value = new gaffa.Property(function (viewModel, value) {
        var options = $(this.renderedElement).find('input');
            
        options.each(function(){
            var option = $(this);
            if(value === option.attr('value')){
                option.attr("checked", "checked");
            }
        });
    });
            
    gaffa.views[viewType] = Radio;

    return Radio;

}));