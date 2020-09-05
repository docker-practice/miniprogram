const fs = require('fs');
const path = require('path');

let { app, ext, game, page, plugin, pluginpage, projectconfig, sitemap, theme } = require('miniprogram-ci/dist/schema/dist').config;

fs.writeFileSync(path.join(__dirname, 'app.schema.json'), JSON.stringify(app));
fs.writeFileSync(path.join(__dirname, 'ext.schema.json'), JSON.stringify(ext));
fs.writeFileSync(path.join(__dirname, 'game.schema.json'), JSON.stringify(game));
fs.writeFileSync(path.join(__dirname, 'page.schema.json'), JSON.stringify(page));
fs.writeFileSync(path.join(__dirname, 'plugin.schema.json'), JSON.stringify(plugin));
fs.writeFileSync(path.join(__dirname, 'pluginpage.schema.json'), JSON.stringify(pluginpage));
fs.writeFileSync(path.join(__dirname, 'projectconfig.schema.json'), JSON.stringify(projectconfig));
fs.writeFileSync(path.join(__dirname, 'theme.schema.json'), JSON.stringify(theme));
fs.writeFileSync(path.join(__dirname, 'sitemap.schema.json'), JSON.stringify(sitemap));
