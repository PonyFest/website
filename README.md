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
2. Pick the version name ($version)
   1. `version=5.5`
3. Create the versioned folder
   1. `mkdir static/${version}`
4. Open the site and save the resulting json for schedule/guest/vendors/panels/etc. See examples below:
   1. Schedule:
      1. Go the developer tools (F12) -> network
      2. Open up the site and go to "http://ponyfest.horse/schedule/"
      3. Find the Name "schedule" and open up the Response
      4. Prettify the results with the "{}" on the bottom (Under Chrome)
      5. Save results to static (static/$version/schedule.json)
   2. 
5. Edit the config.toml, update the paths to /$version
   1. `sed -i "s/baseURL = \"https:\/\/ponyfest.horse\/\"/baseURL = \"https:\/\/ponyfest.horse\/${version}\/\"/g" config.toml`
   2. `sed -i "s/https:\/\/schedule-api.ponyfest.horse\/schedule/\/${version}\/schedule.json/g" config.toml`
6. Update the java scripts to point to the correct details
   3. `sed -i "s/https:\/\/schedule-api.ponyfest.horse\/schedule/\/${version}\/schedule.json/g" static/scripts/menu-script.js`
7. Update the css static file for new version
   1. `sed -i "s/\/images\//\/${version}\/images\//g" static/css/main.css`
   2. `sed -i "s/\/images\//\/${version}\/images\//g" content/_index.md`
   3. `sed -i "s/\/images\//\/${version}\/images\//g" content/pages/shirt.md`
8. Type `hugo -D` to generate the site in "public"
9. Copy the generated output (Minus the versioned folders) into your /static/$version folder
   1. sed -i "s/\/images\//\/${version}\/images\//g" static/$version/css/main.css
10. Test the versioned output with `hugo server -D`
11. Go to the new subdirectory (Bare in mine, dns resolve may point to 404)
12. Verify the versioned sites point to the correct json file
13. Once everything is set, revert the following temp changes
    1. `git checkout HEAD -- config.toml`
    2. `git checkout HEAD -- static/scripts/menu-script.js`
    3. `git checkout HEAD -- static/css/main.css`
    4. `git checkout HEAD -- content/_index.md`
    5. `git checkout HEAD -- content/pages/shirt.md`
14. Update the footer to point to the new version 
15. Inspect few files to make sure pathing is correct
16. Regenerate the new base version
    1. hugo server -D
17. Save and push to GitHub. Don't forget to test the new website once it's deployed.