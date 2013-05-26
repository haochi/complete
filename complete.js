(function($){
  $.fn.complete = function(options){
    return this.each(function(){
      var input = $(this);
      var container = div().addClass(cssClass(c.container));
      var items = div().addClass(cssClass(c.items)).appendTo(container);

      // replace input with container
      input.replaceWith(container);
      container.append(input);

      items.on("click", dotClass(c.close), function(){
        var close = $(this);
        close.closest(dotClass(c.item)).remove();
      });

      items.on("click", dotClass(c.label), function(){
        var label = $(this);
        var item = label.closest(dotClass(c.item));
        item.remove();
        input.focus();
        input.val(label.text());
      });

      items.on("add", function(e, value){
        if(!options.validate(value)){ return; }

        var item = span().addClass(cssClass(c.item));
        var label = span().addClass(cssClass(c.label)).text(value);
        var close = span().addClass(cssClass(c.close)).html("&times;");
        item.append(label);
        item.append(close);
        items.append(item);

        "added" in options && options.added.call(item, value, item);
      });

      input.typeahead(options);

      function add(){
        var label = input.val();
        input.val("");
        items.trigger("add", [label]);
      }

      input.on("blur", function(){
        add();
      });

      input.on('keydown', function(e){
        if(e.which !== keycodes.tab && !~options.delimiters.indexOf(e.which)){
          return;
        }
        if(e.which !== keycodes.tab){
          e.preventDefault();
        }
        add();
        input.focus();
      });
    });
  }

  var c = { // "constants"
    container: "container",
    items: "items",
    item: "item",
    label: "label",
    close: "close",
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
