const axios = require('axios')

module.exports = {
  devServer: {
    before(app) {
      app.get('/api/getSlider', (req, res) => {
        let url = "https://u.y.qq.com/cgi-bin/musicu.fcg";
        axios.get(url, {
          headers: {
            origin: 'https://y.qq.com',
            referer: 'https://y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(err => {
          console.log(err)
        })
      })
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "base": "@/base",
        "components": "@/components",
        "views": "@/views",
        "assets": "@/assets",
        "network": "@/network"
      }
    }
  }
};
