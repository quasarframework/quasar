const { unlinkSync, existsSync, statSync } = require("fs");

const getSquareIcon = require("../utils/get-square-icon");
const { warn } = require("../utils/logger");

module.exports = async function (file, opts, done) {
  const size = Math.min(file.width, file.height);

  const img = opts.background.clone().resize(file.width, file.height).flatten({
    background: opts.splashscreenColor,
  });

  if (opts.splashscreenIconRatio > 0) {
    const icon = getSquareIcon({
      file,
      icon: opts.icon,
      size: Math.round((size * opts.splashscreenIconRatio) / 100),
      padding: opts.padding,
    });

    const compositionArray = [{ input: await icon.toBuffer() }];

    // if this file is a possible nine patch:
    // - cleanup depending on --nine-patch command line option
    // - if nine patch: extend image and add nine patch 'borders' to compositionArray
    if (file.ninePatchCheck) {
      if (opts.ninePatch) {
        if (statSync(file.absoluteName).size > 0) {
          warn(
            "Nine Patch file generation requested, removing non-nine patch file " +
              file.absoluteName
          );
          unlinkSync(file.relativeName);
        }
        file.absoluteName = file.absoluteName.replace(".png", ".9.png");
        file.relativeName = file.relativeName.replace(".png", ".9.png");

        // extend image by 2x2 with transparent 'border'
        img.extend({
          top: 1,
          bottom: 1,
          left: 1,
          right: 1,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        });
        // add black borders to each corner
        ["northwest", "northeast", "southwest", "southeast"].forEach(
          (gravity) => {
            compositionArray.unshift({
              input: {
                create: {
                  width: Math.round((file.width - icon.options.width) / 2),
                  height: Math.round((file.height - icon.options.height) / 2),
                  channels: 4,
                  background: { r: 0, g: 0, b: 0, alpha: 1 },
                },
              },
              gravity: gravity,
              blend: "dest-over",
            });
          }
        );
      } else {
        const ninePatchAbsoluteName = file.absoluteName.replace(
          ".png",
          ".9.png"
        );
        if (existsSync(ninePatchAbsoluteName)) {
          warn(
            "Nine Patch file generation not requested, removing nine patch file " +
              file.relativeName.replace(".png", ".9.png")
          );
          unlinkSync(ninePatchAbsoluteName);
        }
      }
    }

    img.composite(compositionArray);
  }

  img
    .png()
    .toFile(file.absoluteName)
    .then(() => opts.compression.png(file.absoluteName))
    .then(done);
};
