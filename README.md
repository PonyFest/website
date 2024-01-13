# PonyFest

This repository contains the assets required to build the [PonyFest](https://ponyfest.horse/) website.

# Dependencies
In order to build the website, you will need to install the [hugo framework](https://gohugo.io/).

# Example Commands
## Build the website:
`hugo -D`

## Test the website:
`hugo server -D`

# How do you update the website?
The website utilizes GitHub pages (static website). The repo is configured with an action script to automatically build and deploy the website to the gh-pages (GitHub Pages) branch.

# How to save the site for historical version retention
Here's the process of creating a new version. Script TBD. In the meantime follow in a linux shell. Example uses bash syntax. 
1. Pick the version name ($version)
   1. `version=6.25`
2. Create the versioned folder
   1. `mkdir static/${version}`
3. Open the site and save the resulting json for schedule/guest/vendors/panels/etc. See examples below:
   1. Schedule:
      1. Go the developer tools (F12) -> network
      2. Open up the site and go to "http://ponyfest.horse/schedule/"
      3. Find the Name "schedule" and open up the Response
      4. Prettify the results with the "{}" on the bottom (Under Chrome)
      5. Save results to static (static/$version/schedule.json)
4. Edit the config.toml, update the paths to /$version
   1. `sed -i "s/baseURL = \"https:\/\/ponyfest.horse\/\"/baseURL = \"https:\/\/ponyfest.horse\/${version}\/\"/g" config.toml`
   2. `sed -i "s/https:\/\/schedule-api.ponyfest.horse\/schedule/\/${version}\/schedule.json/g" config.toml`
5. Update the java scripts to point to the correct details
   - `sed -i "s/https:\/\/schedule-api.ponyfest.horse\/schedule/\/${version}\/schedule.json/g" static/scripts/menu-script.js`
6. Update the css static file for new version
   1. `sed -i "s/\.\.\/images\//\/${version}\/images\//g" static/css/main.css`
   2. `sed -i "s/url(\/images\//url(\/${version}\/images\//g" static/css/main.css`
   3. `sed -i "s/\/images\//\/${version}\/images\//g" content/_index.md`
   4. `sed -i "s/\/images\//\/${version}\/images\//g" content/pages/shirt.md`
7. Type `hugo -D` to generate the site in "public"
8. Copy the generated output (Minus the versioned folders) into your /static/$version folder
   1. Vendor / Guest - Make sure to change the image links
      1. `sed -i "s:\"/images/guests:\"/$version/images/guests:g" static/$version/vendors/index.html`
      2. `sed -i "s:\"/images/guests:\"/$version/images/guests:g" static/$version/guests/index.html`
   2. cp public/* (minus versioned files) static/$version/.
      1. `find public -maxdepth 1 -type f -exec cp -t static/$version {} +`
      2. `find public -maxdepth 1 -type d  -regextype posix-basic -regex 'public\/[a-zA-Z-]*' -exec cp -r -t static/$version {} +`
9. Test the versioned output with `hugo server -D`
10. Go to the new subdirectory (Bare in mine, dns resolve may point to 404)
11. Verify the versioned sites point to the correct json file
12. Once everything is set, revert the following temp changes
    1. `git checkout HEAD -- config.toml`
    2. `git checkout HEAD -- static/scripts/menu-script.js`
    3. `git checkout HEAD -- static/css/main.css`
    4. `git checkout HEAD -- content/_index.md`
    5. `git checkout HEAD -- content/pages/shirt.md`
13. Update the footer to point to the new version (layouts/partials/footer.html)
14. Inspect few files to make sure pathing is correct
15. Regenerate the new base version
    1. hugo server -D
16. Add the new static files in
    1. `git add static/$version/*`
    2. `git add layouts/partials/footer.html`
    3. `git commit -m "Added version $version into archive"`
17. Save and push to GitHub. Don't forget to test the new website once it's deployed.