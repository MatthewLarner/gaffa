var Gaffa = require('gaffa'),
    actionType = "forEach";

function ForEach(){}
ForEach = Gaffa.createSpec(ForEach, Gaffa.Action);
ForEach.prototype.type = actionType;
ForEach.prototype.target = new Gaffa.Property({
    trackKeys:true
});

ForEach.prototype.trigger = function(parent, scope, event) {

    var items = this.target.value,
        keys = this.target._sourcePathInfo && this.target._sourcePathInfo.subPaths;

    if(!items){
        return;
    }

    if(!scope){
        scope = {};
    }

    for(var i = 0; i < items.length; i++){
        var psudoParent = new EachPsudoParent();
        psudoParent.gaffa = this.gaffa;
        psudoParent.parent = this;
        psudoParent.sourcePath = keys ? keys[i] : '' + i;

        var actions = JSON.parse(JSON.stringify(this.actions['forEach']));

        psudoParent.actions.all = actions;
        psudoParent = this.gaffa.initialiseViewItem(psudoParent, psudoParent.gaffa, psudoParent.actions.constructors);

        scope.item = items[i];

        psudoParent.triggerActions('all', scope, event);
    }
};

function EachPsudoParent(){}
EachPsudoParent = Gaffa.createSpec(EachPsudoParent, Gaffa.Action);
EachPsudoParent.prototype.type = 'eachPsudoParent';

module.exports =  ForEach;