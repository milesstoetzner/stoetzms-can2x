import * as check from '#check'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import _ from 'lodash'
import os from 'os'
import * as path from 'path'
import {v4 as uuid4} from 'uuid'
import * as utils from './utils'

export const TMP_PREFIX = 'stoetzms-can2x-'

export function exists(file: string) {
    return fs.existsSync(file)
}

export function assertFile(file: string) {
    if (!isFile(file)) throw new Error(`File "${file}" does not exist`)
}

export function assertDirectory(dir: string, file = false) {
    if (file) {
        assertDirectory(path.dirname(dir))
    } else {
        if (!isDirectory(dir)) throw new Error(`Directory "${dir}" does not exist`)
    }
}

export function isEmpty(dir: string) {
    const resolved = path.resolve(dir)
    return fs.readdirSync(resolved).length === 0
}

export function assertEmpty(dir: string) {
    const resolved = path.resolve(dir)
    if (!isEmpty(resolved)) throw new Error(`Directory "${resolved}" is not empty`)
}

export function isFile(path: string) {
    return exists(path) && fs.lstatSync(path).isFile()
}

export function isDirectory(path: string) {
    return exists(path) && fs.lstatSync(path).isDirectory()
}

export function getSize(file: string) {
    assertFile(file)
    return fs.lstatSync(file).size
}

export function countLines(file: string) {
    assertFile(file)
    return fs.readFileSync(path.resolve(file), 'utf-8').split(/\r?\n/).length
}

export function isLink(path: string) {
    return path.startsWith('http://') || path.startsWith('https://')
}

export function loadFile(file: string) {
    assertFile(file)
    return fs.readFileSync(path.resolve(file), 'utf-8')
}

export function loadYAML<T>(file: string) {
    return yaml.load(loadFile(file)) as T
}

export async function createFile(file: string) {
    const handle = await fs.promises.open(path.resolve(file), 'a+')
    await handle.close()
}

export function storeFile(file: string, data: string) {
    fs.writeFileSync(path.resolve(file), data)
    return file
}

export function storeYAML(file: string, data: any | string) {
    fs.writeFileSync(path.resolve(file), check.isString(data) ? data : toYAML(data))
    return file
}

export function storeJSON(file: string, data: any | string) {
    fs.writeFileSync(path.resolve(file), check.isString(data) ? data : toJSON(data))
    return file
}

export function storeENV(file: string, data: any | string) {
    fs.writeFileSync(path.resolve(file), check.isString(data) ? data : toENV(data))
    return file
}

export function toYAML(obj: any, options?: yaml.DumpOptions) {
    return yaml.dump(
        obj,
        _.merge(
            {
                styles: {
                    '!!null': 'empty',
                },
            },
            options
        )
    )
}

export function toJSON(obj: any) {
    return utils.pretty(obj)
}

export function toENV(obj: {[key: string]: string | number | boolean}) {
    return Object.entries(obj)
        .map(([key, value]) => `${key}="${value}"`)
        .join(`\n`)
}

export function listDirectories(directory: string): string[] {
    return fs
        .readdirSync(directory, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name.toString())
}

export function listFiles(directory: string): string[] {
    return fs
        .readdirSync(directory, {withFileTypes: true})
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name.toString())
}

export function createDirectory(directory: string) {
    const resolved = path.resolve(directory)
    if (!fs.existsSync(resolved)) {
        fs.mkdirSync(resolved, {recursive: true})
    }
}

export function deleteDirectory(directory: string) {
    const resolved = path.resolve(directory)
    fs.rmSync(resolved, {recursive: true, force: true})
}

export async function deleteFile(file: string) {
    fs.unlinkSync(path.resolve(file))
}

export function getDirectory(file: string) {
    return path.parse(path.resolve(file)).dir
}

export function getFilename(file: string) {
    return path.parse(path.resolve(file)).base
}

export function getName(file: string) {
    return path.parse(path.resolve(file)).name
}

export function temporary(name?: string) {
    return path.join(os.tmpdir(), TMP_PREFIX + (name || uuid4()))
}

export function stat(file: string) {
    return fs.statSync(file)
}
