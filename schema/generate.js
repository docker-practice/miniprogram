const fs = require('fs');
const path = require('path');

let { app, ext, game, page, plugin, pluginpage, projectconfig, sitemap, theme } = require('miniprogram-ci/dist/schema/dist').config;

fs.writeFileSync(path.join(__dirname, 'app.json'), JSON.stringify(app));
fs.writeFileSync(path.join(__dirname, 'ext.json'), JSON.stringify(ext));
fs.writeFileSync(path.join(__dirname, 'game.json'), JSON.stringify(game));
fs.writeFileSync(path.join(__dirname, 'page.json'), JSON.stringify(page));
fs.writeFileSync(path.join(__dirname, 'plugin.json'), JSON.stringify(plugin));
fs.writeFileSync(path.join(__dirname, 'pluginpage.json'), JSON.stringify(pluginpage));
fs.writeFileSync(path.join(__dirname, 'projectconfig.json'), JSON.stringify(projectconfig));
fs.writeFileSync(path.join(__dirname, 'theme.json'), JSON.stringify(theme));
fs.writeFileSync(path.join(__dirname, 'sitemap.json'), JSON.stringify(sitemap));
