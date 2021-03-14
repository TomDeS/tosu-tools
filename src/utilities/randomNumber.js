// exports.randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

exports.randomNumber = (min, max) => {
  // Window is not available at build time!
  if (typeof window !== "undefined") {
    const range = max - min
    const int = window.crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32
    return Math.floor(int * range + min)
  }
}
