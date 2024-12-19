ChromaCycle 🌅

A GNOME Extension to Refresh Your Desktop Experience, One Day at a Time.
🚀 Overview

ChromaCycle brings life to your desktop by automatically changing your background daily with images from your existing library. Whether you're a nature lover, a cityscape enthusiast, or an abstract art fan, ChromaCycle ensures your desktop stays fresh and inspiring.
🌟 Features

    Dynamic Background Changes: Automatically switches your background every 24 hours.
    Local Image Library Support: Uses images from your favorite folder of backgrounds.
    Lightweight & Efficient: Runs seamlessly in the background without affecting performance.
    Fully Automated: No manual effort required after setup.

📦 Installation

    Download the Extension:
    Clone or download this repository:

git clone https://github.com/yourname/chromacycle.git](https://github.com/rayanprasanna/chroma-cycle.git

Move to Extensions Folder:
Copy the files to your GNOME extensions directory:

mkdir -p ~/.local/share/gnome-shell/extensions/chromacycle@yourname
cp -r chromacycle/* ~/.local/share/gnome-shell/extensions/chromacycle@yourname

Enable the Extension:
Activate ChromaCycle using the gnome-extensions tool:

    gnome-extensions enable chromacycle@yourname

    Reload GNOME Shell:
        On X11: Press Alt + F2, type r, and press Enter.
        On Wayland: Log out and log back in.

⚙️ Configuration

To customize the folder or frequency of background changes:

    Open the extension settings (from GNOME Extensions or Tweaks).
    Select your image directory.
    Adjust the time interval if needed.
    (Settings panel is coming soon!)

🛠️ Development

Want to contribute or tweak ChromaCycle? Here’s how you can get started:

    Fork the repository and clone it locally.
    Make changes to extension.js to customize behavior.
    Test your changes:

    gnome-extensions enable chromacycle@yourname
    gnome-shell --replace

    Submit a pull request with your enhancements!

🐛 Troubleshooting

    Extension not appearing?
    Check the GNOME Shell logs for errors:

    journalctl /usr/bin/gnome-shell -f

    Backgrounds not changing?
    Ensure your selected directory contains valid image files (.jpg, .png).

❤️ Support the Project

If you love ChromaCycle, consider starring this repository ⭐ or sharing it with others!
📜 License

This project is licensed under the MIT License. See the LICENSE file for details.
🌍 Connect With Us

    Author: Delath Rayan Prasanna De Zoysa
    GitHub Repository: ChromaCycle

