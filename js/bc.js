/*
  Bookmark Commander by Tom J Demuyt is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  Permissions beyond the scope of this license are available by contacting konijn@gmail.com
*/

//Extend String with repeat, we need it
String.prototype.repeat = function (num) {
    return new Array(num + 1).join(this);
}

//Extend String with extend, muhahah
String.prototype.extend = function (till) {
    if (!till) {
        till = data.screenWidth;
    }
    return (this + " ".repeat(till)).substring(0, till).replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

//Need moar sugar
//Note that this takes also an array with possible prefixes
String.prototype.startsWith = function (str) {
    if (typeof str === "string") {
        return (this.indexOf(str) === 0);
    }

    if (typeof str === "object") {
        return Object.keys(str).map(key => this.startsWith(str[key])).reduce((acc, elem) => acc || elem);
    }
    return false;
}

String.prototype.replaceAll = function (needle, prick) {
    let s = this;
    while (s.indexOf(needle) >= 0) {
        s = s.replace(needle, prick);
    }
    return s;
}

//html 5 should have stuff like this, really..
String.prototype.remove = function (needle) {
    return this.replaceAll(needle, "");
}

//BASIC for the win
String.prototype.left = function (n) {
    if (n > this.length) {
        return this;
    }
    return this.substring(0, n);
}

//Some more winner BASIC
String.prototype.right = function (len) {
    return (len > this.length) ? this : this.substring(this.length - len);
}

//I hate dealing with -1 so I stick it here
String.prototype.has = function (s) {
    return (this.indexOf(s) != -1);
}


Date.prototype.format = function () {
    let day = this.getDate();
    let month = this.getMonth() + 1;
    let year = this.getYear() + 1900;

    return (month + "/" + day + "/" + year);
}

// Don't add this to Array.prototype or all calls to 'for (... in ...)' will see that as a key of an array (while Object.keys(...).forEach won't)
const pairToObject = function (array) {
    return array.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
}

const sum = function (array) {
    return array.reduce((acc, elem) => acc + elem);
}

const createElement = (name, properties, args) => {
    const element = document.createElement(name);
    Object.keys(properties).forEach(key => {
        element[key] = properties[key];
    })
    args = args || {};
    if (args.appendTo && args.appendTo.appendChild) {
        args.appendTo.appendChild(element);
    }
    return element;
}

const iconURL = chrome.extension.getURL("/bc-16x16-l.png");
const link = createElement("link", { type: 'image/x-icon', rel: 'shortcut icon', href: iconURL }, { appendTo: this.document.head });

