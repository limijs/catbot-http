class Command {
  /**
   * @typedef {Object} CommandOptions
   * @property {string} name
   * @property {string} description
   * @param {CommandOptions} options
   */
  constructor(options) {
    this.data = {
      name: options.name,
      description: options.description,
    }
  }

  run() {}
}

module.exports = Command
