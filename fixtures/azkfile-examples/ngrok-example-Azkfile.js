/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  ngrok: {
    // Dependent systems
    depends: [],
    image:  {"docker"  : "azukiapp/ngrok"},
    // Mounts folders to assigned paths
    mounts: {
      // equivalent persistent_folders
      '/ngrok/log'  : path("./log"),
    },
    scalable: {"default ": 1},
    // do not expect application response
    wait: false,
    http: {
      domains: [ "#{manifest.dir}-#{system.name}.#{azk.default_domain}" ],
    },
    ports: {
      http: "4040"
    },
    envs: {
      NGROK_LOG        : "/ngrok/log/ngrok.log",
      NGROK_SUBDOMAIN  : "sgdemo-pokemon",
      NGROK_AUTH       : "rTz5WboOOSMqVrFudJ1C",
      NGROK_CONFIG     : "/ngrok/ngrok.yml",
    }
  }
});
