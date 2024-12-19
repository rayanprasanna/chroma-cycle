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

const { GLib, Gio, St } = imports.gi;
const Main = imports.ui.main;

let timer = null;
const BACKGROUND_PATH = "/usr/share/backgrounds"; // Path to existing images
const CHANGE_INTERVAL = 24 * 60 * 60 * 1000; // Change every 24 hours

function listBackgroundImages() {
    const dir = Gio.File.new_for_path(BACKGROUND_PATH);
    if (!dir.query_exists(null)) return [];

    const enumerator = dir.enumerate_children(
        "standard::name",
        Gio.FileQueryInfoFlags.NONE,
        null
    );

    let files = [];
    let info;
    while ((info = enumerator.next_file(null))) {
        const fileName = info.get_name();
        if (fileName.match(/\.(jpg|jpeg|png)$/)) {
            files.push(GLib.build_filenamev([BACKGROUND_PATH, fileName]));
        }
    }
    return files;
}

function setRandomBackground() {
    const images = listBackgroundImages();
    if (images.length === 0) {
        log("No background images found!");
        return;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const settings = new Gio.Settings({ schema: "org.gnome.desktop.background" });
    settings.set_string("picture-uri", `file://${randomImage}`);
    log(`Background changed to: ${randomImage}`);
}

function enable() {
    setRandomBackground();
    timer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, CHANGE_INTERVAL, () => {
        setRandomBackground();
        return GLib.SOURCE_CONTINUE;
    });
}

function disable() {
    if (timer) {
        GLib.Source.remove(timer);
        timer = null;
    }
}

