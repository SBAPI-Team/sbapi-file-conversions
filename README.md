SBAPI File Conversion library
===

This is the file conversion library used for the SmileBASIC API. It handles 99% of the legal encodings provided by SBAPI, minus ones like info and list (which are handled by SBAPI itself).

Note that for performance reasons, this library uses a native Node.js library for encoding PNG files (node-libpng), and thus won't work in the browser as-is. We'll likely release a fork with the PNG library replaced with a non-native library in the future.