(function($){
  $.fn.complete = function(options){
    return this.each(function(){
      var input = $(this);
      var name = input.attr("name");
      var container = div().addClass(cssClass(c.container));
      var items = div().addClass(cssClass(c.items)).appendTo(container);

      function add(){
        var label = input.val();
        input.val("");
        items.trigger("add", [label]);
      }

      // move input classes to container
      container.addClass(input.attr("class"));
      input.attr("class", "").addClass(cssClass(c.input))

      // replace input with container
      input.replaceWith(container);
      items.append(input);

      // here follows are event handlers

      items.on("click", dotClass(c.close), function(){
        var close = $(this);
        close.closest(dotClass(c.item)).remove();
      });

      items.on("click", dotClass(c.label), function(){
        var label = $(this);
        var item = label.closest(dotClass(c.item));
        var hidden = item.find(dotClass(c.hidden));
        var value = hidden.val();
        item.remove();
        input.focus();
        input.val(value);
      });

      items.on("add", function(e, value){
        if(!options.validate(value)){ return; }

        var item = span().addClass(cssClass(c.item));
        var label = span().addClass(cssClass(c.label)).text(value);
        var close = span().addClass(cssClass(c.close)).html("&times;");
        var hidden = $("<input>").attr({
          name: name,
          type: c.hidden,
          value: value,
        }).addClass(cssClass(c.hidden));

        item.append(label);
        item.append(close);
        item.append(hidden);
        item.insertBefore(input);

        "added" in options && options.added.call(item, value, item);
      });

      container.on("click", function(e){
        if(e.target === this){
          input.focus();
        }
      });

      input.on("blur", function(){
        add();
      });

      input.on("keydown", function(e){
        if(e.which !== keycodes.tab && !~options.delimiters.indexOf(e.which)){
          return;
        }
        if(e.which !== keycodes.tab){
          e.preventDefault();
        }
        add();
        input.focus();
      });

      // initiate typeahead
      input.typeahead(options);
    });
  }

  // constants + helper functions

  var c = { // "constants"
    container: "container",
    items: "items",
    item: "item",
    label: "label",
    close: "close",
    hidden: "hidden",
    input: "input",
  };
  var keycodes = {
    tab: 9,
  };

  var cssClass = function(name){
    return "complete-"+name;
  };
  var dotClass = function(name){
    return "." + cssClass(name);
  };
  var span = function(){
    return $("<span>");
  };
  var div = function(){
    return $("<div>");
  };
})(jQuery);
