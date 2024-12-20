/*
 * Chromo Cycle
 * 
 * Copyright (C) [2024] [Delath Rayan Prasanna De Zoysa]
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { Gio, GLib, St } = imports.gi;
const Main = imports.ui.main;

let backgroundChangerTimeout;
const ONE_DAY = 24 * 60 * 60 * 1000; // One day in milliseconds
const IMAGE_FOLDER = GLib.get_home_dir() + '/Pictures/Wallpapers'; // Path to your wallpaper folder

function setRandomBackground() {
    const dir = Gio.File.new_for_path(IMAGE_FOLDER);
    const enumerator = dir.enumerate_children('standard::name', Gio.FileQueryInfoFlags.NONE, null);

    let images = [];
    let fileInfo;

    while ((fileInfo = enumerator.next_file(null)) !== null) {
        const fileName = fileInfo.get_name();
        if (fileName.endsWith('.jpg') || fileName.endsWith('.png')) {
            images.push(IMAGE_FOLDER + '/' + fileName);
        }
    }

    if (images.length === 0) {
        log('No images found in the wallpaper folder.');
        return;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const settings = new Gio.Settings({ schema: 'org.gnome.desktop.background' });
    settings.set_string('picture-uri', 'file://' + randomImage);

    log('Background changed to: ' + randomImage);
}

function init() {
    log('Background Changer extension initialized.');
}

function enable() {
    log('Background Changer extension enabled.');
    setRandomBackground();
    backgroundChangerTimeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, ONE_DAY, () => {
        setRandomBackground();
        return GLib.SOURCE_CONTINUE;
    });
}

function disable() {
    log('Background Changer extension disabled.');
    if (backgroundChangerTimeout) {
        GLib.Source.remove(backgroundChangerTimeout);
        backgroundChangerTimeout = null;
    }
}
