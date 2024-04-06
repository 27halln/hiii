import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(chalk.blue('Copying files...'));
fs.copy(path.join(__dirname, 'src'), path.join(__dirname, 'dist/src/'))
console.log(chalk.green('Files copied!'));
