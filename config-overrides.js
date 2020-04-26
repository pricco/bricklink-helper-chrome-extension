module.exports = (config, env) => {
  //JS Overrides
  config.output.filename = 'static/js/[name].js';
  config.output.chunkFilename = 'static/js/[name].chunk.js';
  //CSS Overrides
  config.plugins[5].options.filename = 'static/css/[name].css';
  config.plugins[5].options.moduleFilename = () => 'static/css/[name].css';
  config.plugins[5].options.chunkFilename = 'static/css/[name].chunk.css';
  ////Media and Assets Overrides
  //// config.module.rules[0].oneOf[0].options.name = 'static/media/[name].[ext]';
  //// config.module.rules[0].oneOf[3].options.name = 'static/media/[name].[ext]';
  //// Chunks
  config.optimization.runtimeChunk = false;
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false,
    },
  };
  return config;
};
