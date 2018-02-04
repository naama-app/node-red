const { promisify } = require("util");
const jimp = require("jimp");

module.exports = function(RED) {
  function ResizeNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on("input", function(msg) {
      const { x, y, w, h } = msg.crop;

      jimp
        .read(msg.payload)
        .then(image => promisify(image.crop.bind(image))(x, y, w, h))
        .then(image => promisify(image.getBuffer.bind(image))(jimp.AUTO))
        .then(buff => {
          msg.payload = buff;
          this.send(msg);
        })
        .catch(err => {
          this.error(err);
        });
    });
  }
  RED.nodes.registerType("resize-image", ResizeNode);
};
