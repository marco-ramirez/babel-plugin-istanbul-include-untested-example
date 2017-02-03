import glob from 'glob';
import {transform} from 'babel-core';
import fs from 'fs';
import {hookRequire} from 'istanbul-lib-hook';
import Mocha from 'mocha';
import path from 'path';
import {Collector, Reporter} from 'istanbul';

const babelOptions = {
    presets: ['node6'],
    plugins: [
        ['istanbul', {includeUntested: true}]
    ]
};

const report = () => {
    const reporter = new Reporter();
    const collector = new Collector();
    reporter.add('text');
    collector.add(global.__coverage__);
    reporter.write(collector, false, () => {});
};

const runTests = () => {
    glob('test/**/*.js', (error, files) => {
        const mocha = new Mocha();
        files.forEach(file => mocha.addFile(file));
        mocha.run().on('end', report);
    });
};

glob('src/**/*.js', (error, files) => {
    const instrument = filename =>
        transform(fs.readFileSync(filename, {encoding: 'utf8'}), {...babelOptions, filename}).code;
    const cache = files.reduce((map, file) => {
        const filePath = path.resolve(file);
        return {...map, [filePath]: instrument(filePath)};
    }, {});
    const matcher = file => cache.hasOwnProperty(file);
    const transformer = (code, file) => cache[file];
    hookRequire(matcher, transformer);
    runTests();
});
