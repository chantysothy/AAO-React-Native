#!/usr/bin/env node
const fs = require('fs')
const junk = require('junk')
const path = require('path')
const bundleDataDir = require('./bundle-data-dir')
const convertDataFile = require('./convert-data-file')

const isDir = pth => fs.statSync(pth).isDirectory()
const isFile = pth => fs.statSync(pth).isFile()
const readDir = pth => fs.readdirSync(pth).filter(junk.not).filter(entry => !entry.startsWith('_'))
const findDirsIn = pth => readDir(pth).filter(entry => isDir(path.join(pth, entry)))
const findFilesIn = pth => readDir(pth).filter(entry => isFile(path.join(pth, entry)))

const args = process.argv.slice(2)
const fromDir = args[0]
const toDir = args[1]
if (!fromDir || !toDir || fromDir === '-h' || fromDir === '--help') {
  console.error('usage: node bundle-data.js <from-dir> <to-dir>')
  process.exit(1)
}

// Bundle each directory of yaml files into one big json file
const dirs = findDirsIn(fromDir)
dirs.forEach(dirname => {
  const input = path.join(fromDir, dirname)
  const output = path.join(toDir, dirname) + '.json'
  console.time(`bundle-data-dir ${input} ${output}`)
  bundleDataDir({fromDir: input, toFile: output})
  console.timeEnd(`bundle-data-dir ${input} ${output}`)
})

// Convert these files into JSON equivalents
const files = findFilesIn(fromDir)
files.forEach(file => {
  const input = path.join(fromDir, file)
  const output = path.join(toDir, file).replace(/\.(.*)$/, '.json')
  console.time(`convert-data-file ${input} ${output}`)
  convertDataFile({fromFile: input, toFile: output})
  console.timeEnd(`convert-data-file ${input} ${output}`)
})
