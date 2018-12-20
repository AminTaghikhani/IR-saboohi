const process = require('process');

const BREAKLINE = '\n';

class Output {
  print(message) {
    process.stdout.write(message);
  }

  printLine(message) {
    process.stdout.write(message);
    process.stdout.write(BREAKLINE);
  }
}
module.exports = new Output();
