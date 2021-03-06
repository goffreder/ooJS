/*!
* QuodJS - Object Oriented JavaScript v0.0.1
* http://goffreder.github.io
*
* Copyright 2014, Emanuele Biancardi
* Released under the MIT License
*/
(function(scope) {
	Object.defineProperty(Object.prototype, "Class", {
		value : function(name, properties, prototype) {
            var func = "return function " + name + "(){";
            func += " return this; }";
			scope[name] = new Function(
				func
			)();
			for(var p in properties) {
				scope[name][p] = properties[p];
			}
			scope[name].prototype = prototype;
			return scope[name];
		}
	});
	Object.defineProperty(Object.prototype, "New", {
		value : function(Classname) {
			var obj = new scope[Classname]();
			for(var p in scope[Classname])
				obj[p] = scope[Classname][p];
			return obj;
		}
	});
	Object.defineProperty(Function.prototype, "Extends", {
		value: function (Classname) {
			for(var p in scope[Classname].prototype)
				if('undefined' === typeof this.prototype[p]) {
					this.prototype[p] = scope[Classname].prototype[p];
					if('undefined' === typeof this.prototype.heritage)
						this.prototype.heritage = {};
					if('undefined' !== typeof scope[Classname].prototype.heritage)
						this.prototype.heritage[p] = scope[Classname].prototype.heritage[p] || Classname;
					else
						this.prototype.heritage[p] = Classname;
			}
			for(var p in scope[Classname])
				if('undefined' === typeof this[p]) {
					this[p] = scope[Classname][p];
					if('undefined' === typeof this.prototype.heritage)
						this.prototype.heritage = {};
					if('undefined' !== typeof scope[Classname].prototype.heritage)
						this.prototype.heritage[p] = scope[Classname].prototype.heritage[p] || Classname;
					else
						this.prototype.heritage[p] = Classname;
				}
			this.prototype.superclass = scope[Classname];
		}
	});
	Object.defineProperty(Object.prototype, "Super", {
		value : function(p) {
			var caller = arguments.callee.caller.name;
			var args = [].splice.call(arguments, 0);
			args.splice(0, 1);
			var prop;
			if('undefined' !== typeof this.heritage[caller]) { prop = scope[this.heritage[caller]].prototype.superclass.prototype[p]; }
			else { prop = this.superclass.prototype[p]; }
			if('function' === typeof prop)
				return prop.apply(this, args);
			return prop;
		}
	});
})(this);
