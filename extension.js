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

'use strict';

// Version-specific imports
const GNOME_VERSION = parseInt(imports.misc.config.PACKAGE_VERSION.split('.')[0]);

// Import GLib, Gio, and GObject based on GNOME version
let GLib, Gio, GObject, St;
if (GNOME_VERSION >= 45) {
    GLib = imports('gi://GLib');
    Gio = imports('gi://Gio');
    GObject = imports('gi://GObject');
    St = imports('gi://St');
} else {
    GLib = imports.gi.GLib;
    Gio = imports.gi.Gio;
    GObject = imports.gi.GObject;
    St = imports.gi.St;
}

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const WALLPAPER_SCHEMA = 'org.gnome.desktop.background';
const WALLPAPER_KEY = 'picture-uri';
const WALLPAPER_DARK_KEY = 'picture-uri-dark';
const DEFAULT_DIRECTORY = GLib.get_home_dir() + '/Pictures/Wallpapers';

const DailyScapeIndicator = GObject.registerClass(
class DailyScapeIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'DailyScape Background Changer');

        // Create the menu
        this._createMenu();
        
        // Initialize settings
        this._settings = new Gio.Settings({ schema: WALLPAPER_SCHEMA });
        
        // Set up timer for daily changes
        this._setupTimer();
        
        // Change wallpaper on startup
        this._changeWallpaper();
    }

    _createMenu() {
        // Add icon
        let icon = new St.Icon({
            icon_name: 'preferences-desktop-wallpaper-symbolic',
            style_class: 'system-status-icon'
        });
        this.add_child(icon);

        // Add "Change Now" button
        let changeNowItem = new PopupMenu.PopupMenuItem('Change Wallpaper Now');
        changeNowItem.connect('activate', () => {
            this._changeWallpaper();
        });
        this.menu.addMenuItem(changeNowItem);

        // Add separator
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        // Add "Open Wallpaper Folder" button
        let openFolderItem = new PopupMenu.PopupMenuItem('Open Wallpaper Folder');
        openFolderItem.connect('activate', () => {
            this._openWallpaperFolder();
        });
        this.menu.addMenuItem(openFolderItem);
    }

    _setupTimer() {
        // Check time until next day
        let now = GLib.DateTime.new_now_local();
        let tomorrow = GLib.DateTime.new_local(
            now.get_year(),
            now.get_month(),
            now.get_day_of_month() + 1,
            0, 0, 0
        );
        let timeUntilTomorrow = tomorrow.difference(now);

        // Set up timer for next day
        this._timerId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeUntilTomorrow/1000, () => {
            this._changeWallpaper();
            // Reset timer for next day (24 hours)
            this._timerId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 24 * 60 * 60 * 1000, () => {
                this._changeWallpaper();
                return GLib.SOURCE_CONTINUE;
            });
            return GLib.SOURCE_REMOVE;
        });
    }

    _getWallpaperFiles() {
        let directory = Gio.File.new_for_path(DEFAULT_DIRECTORY);
        let imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        let wallpapers = [];

        try {
            let enumerator = directory.enumerate_children('standard::*', Gio.FileQueryInfoFlags.NONE, null);
            let info;
            while ((info = enumerator.next_file(null))) {
                let filename = info.get_name();
                if (imageExtensions.some(ext => filename.toLowerCase().endsWith(ext))) {
                    wallpapers.push(directory.get_child(filename).get_path());
                }
            }
        } catch (e) {
            log(`DailyScape: Error reading wallpaper directory: ${e}`);
            Main.notifyError('DailyScape', 'Error reading wallpaper directory');
        }

        return wallpapers;
    }

    _changeWallpaper() {
        let wallpapers = this._getWallpaperFiles();
        if (wallpapers.length === 0) {
            log('DailyScape: No wallpapers found');
            return;
        }

        // Get random wallpaper
        let index = Math.floor(Math.random() * wallpapers.length);
        let wallpaperUri = GLib.filename_to_uri(wallpapers[index], null);

        // Set both light and dark mode wallpapers
        this._settings.set_string(WALLPAPER_KEY, wallpaperUri);
        this._settings.set_string(WALLPAPER_DARK_KEY, wallpaperUri);
    }

    _openWallpaperFolder() {
        let uri = GLib.filename_to_uri(DEFAULT_DIRECTORY, null);
        try {
            Gio.app_info_launch_default_for_uri(uri, null);
        } catch (e) {
            log(`DailyScape: Error opening wallpaper folder: ${e}`);
        }
    }

    destroy() {
        if (this._timerId) {
            GLib.source_remove(this._timerId);
        }
        super.destroy();
    }
});

let dailyScapeIndicator;

function init() {
    return new DailyScapeIndicator();
}

function enable() {
    dailyScapeIndicator = new DailyScapeIndicator();
    Main.panel.addToStatusArea('dailyscape', dailyScapeIndicator);
}

function disable() {
    if (dailyScapeIndicator) {
        dailyScapeIndicator.destroy();
        dailyScapeIndicator = null;
    }
}
