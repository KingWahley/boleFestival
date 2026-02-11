window.addEvent("domready", function () {
  var imagewall = [
    ["the-wall/1.jpg", [["the-wall/1-2.jpg", ""]]],
    ["the-wall/2.jpg", [["the-wall/2-2.jpg", ""]]],
    ["the-wall/3.jpg", [["the-wall/3-2.jpg", ""]]],
    ["the-wall/4.jpg", [["the-wall/4-2.jpg", ""]]],
    ["the-wall/5.jpg", [["the-wall/5-2.jpg", ""]]],
    ["the-wall/6.jpg", [["the-wall/6-2.jpg", ""]]],
    ["the-wall/7.jpg", [["the-wall/7-2.jpg", ""]]],
    ["the-wall/8.jpg", [["the-wall/8-2.jpg", ""]]],
    ["the-wall/9.jpg", [["the-wall/9-2.jpg", ""]]],
    ["the-wall/10.jpg", [["the-wall/10-2.jpg", ""]]],
    ["the-wall/11.jpg", [["the-wall/11-2.jpg", ""]]],
    ["the-wall/12.jpg", [["the-wall/12-2.jpg", ""]]],
    [
      "the-wall/13.jpg",
      [
        ["the-wall/13-2.jpg", ""],
        ["the-wall/13-3.jpg", ""],
        ["the-wall/13-4.jpg", ""],
      ],
    ],
    ["the-wall/14.jpg", [["the-wall/14-2.jpg", ""]]],
    ["the-wall/15.jpg", [["the-wall/15-2.jpg", ""]]],
    ["the-wall/16.jpg", [["the-wall/16-2.jpg", ""]]],
    ["the-wall/17.jpg", [["the-wall/17-2.jpg", ""]]],
    ["the-wall/18.jpg", [["the-wall/18-2.jpg", ""]]],
    ["the-wall/19.jpg", [["the-wall/19-2.jpg", ""]]],
    ["the-wall/20.jpg", [["the-wall/20-2.jpg", ""]]],
    ["the-wall/21.jpg", [["the-wall/21-2.jpg", ""]]],
    ["the-wall/22.jpg", [["the-wall/22-2.jpg", ""]]],
    ["the-wall/23.jpg", [["the-wall/23-2.jpg", ""]]],
    ["the-wall/24.jpg", [["the-wall/24-2.jpg", ""]]],
    ["the-wall/25.jpg", [["the-wall/25-2.jpg", ""]]],
    ["the-wall/26.jpg", [["the-wall/26-2.jpg", ""]]],
    ["the-wall/27.jpg", [["the-wall/27-2.jpg", ""]]],
    ["the-wall/28.jpg", [["the-wall/28-2.jpg", ""]]],
    ["the-wall/29.jpg", [["the-wall/29-2.jpg", ""]]],
    ["the-wall/30.jpg", [["the-wall/30-2.jpg", ""]]],
    ["the-wall/31.jpg", [["the-wall/31-2.jpg", ""]]],
    ["the-wall/32.jpg", [["the-wall/32-2.jpg", ""]]],
    ["the-wall/33.jpg", [["the-wall/33-2.jpg", ""]]],
    ["the-wall/34.jpg", [["the-wall/34-2.jpg", ""]]],
    ["the-wall/35.jpg", [["the-wall/35-2.jpg", ""]]],
    ["the-wall/36.jpg", [["the-wall/36-2.jpg", ""]]],
  ];

  var maxLength = imagewall.length;
  var loaded = 0;
  imagewall.forEach(function (tile) {
    var img = new Image();
    img.src = tile[0];
    img.onload = img.onerror = function () {
      loaded++;
      if (loaded === imagewall.length) initWall();
    };
  });

  function initWall() {
    var wall = new Wall("wall", {
      draggable: true,
      inertia: true,
      slideshow: false,
      speed: 1000,
      transition: Fx.Transitions.Quad.easeOut,
      autoposition: true,
      width: 300,
      height: 320,
      rangex: [-100, 100],
      rangey: [-100, 100],

      callOnUpdate: function (items) {
        var root = Math.ceil(Math.sqrt(maxLength));
        items.forEach(function (item) {
          var pos =
            (Math.abs(item.y) % root) * root + (Math.abs(item.x) % root);
          if (pos >= maxLength) {
            pos = Math.floor(Math.random() * maxLength);
          }

          item.node.empty();
          item.node.addClass("wall-item");

          item.node.setStyles({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "url('" + imagewall[pos][0] + "')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          });

          item.slidesRendered = false;

          item.node.addEvent("mouseenter", function () {
            if (item.slidesRendered) return;

            var slides = imagewall[pos][1];
            if (!slides || !slides.length) return;
            var ul = new Element("ul", {
              class: "slideshow",
            });
            slides.forEach(function (slide) {
              var li = new Element("li");

              var img = new Element("img", {
                src: slide[0],
                loading: "lazy",
              });

              img.setStyles({
                width: "100%",
                height: "100%",
                objectFit: "cover",
              });

              img.inject(li);
              li.inject(ul);
            });

            ul.inject(item.node);
            item.slidesRendered = true;
          });
        });
      },
    });
    wall.initWall();
  }
});
