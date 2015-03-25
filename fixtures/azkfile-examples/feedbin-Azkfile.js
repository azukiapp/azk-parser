/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  feedbin: {
    // Dependent systems
    depends: ["clock", "worker-slow", "worker", "redis", "postgres", "elasticsearch", "memcached"],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/ruby:2.1.4"},
    // Steps to execute before running instances
    provision: [
      "bundle install --path /azk/bundler",
    ],
    workdir: "/azk/#{manifest.dir}/feedbin",
    shell: "/bin/bash",
    command: "bundle exec rackup config.ru --pid /tmp/ruby.pid --port $HTTP_PORT --host 0.0.0.0",
    wait: {"retry": 40, "timeout": 10000},
    mounts: {
      '/azk/#{manifest.dir}/feedbin': path("./feedbin"),
      '/azk/bundler': persistent("bundler"),
    },
    scalable: {"default": 1},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    envs: {
      // set instances variables
      RUBY_ENV: "development",
      BUNDLE_APP_CONFIG: "/azk/bundler",
    },
  },
  worker: {
    extends: 'feedbin',
    provision: [
      "bundle install --path /azk/bundler",
      "bundle exec rake db:setup",
    ],
    depends: ["postgres", "redis", "elasticsearch", "memcached"],
    command: 'bundle exec sidekiq -c 12 -q critical,2 -q feed_refresher_receiver,1 -q default',
    scalable: { limit: 1, default: 1},
    http: null,
    envs: {
      DB_POOL: 12,
      LIBRATO_AUTORUN: 1
    }
  },
  "worker-slow": {
    extends: 'feedbin',
    depends: ["postgres", "redis", "elasticsearch", "memcached"],
    command: 'bundle exec sidekiq -c 1 -q worker_slow_critical,3 -q worker_slow,2 -q favicon,1',
    scalable: { default: 1,  limit: 1 },
    http: null,
    envs: {
      DB_POOL: 1
    }
  },
  clock: {
    extends: 'feedbin',
    depends: ["postgres", "redis", "elasticsearch", "memcached"],
    command: 'bundle exec clockwork lib/clock.rb',
    scalable: { default: 1,  limit: 1 },
    http: null,
  },
  refresher: {
    // Dependent systems
    depends: ["redis"],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/ruby:2.2"},
    // Steps to execute before running instances
    provision: [
      "bundle install --path /azk/bundler",
    ],
    workdir: "/azk/#{manifest.dir}/refresher",
    shell: "/bin/bash",
    command: "bundle exec sidekiq -c 20 -q feed_refresher_fetcher_critical,2 -q feed_refresher_fetcher -r ./app/boot.rb",
    wait: {"retry": 20, "timeout": 1000},
    mounts: {
      '/azk/#{manifest.dir}/refresher': path("./refresher"),
      '/azk/bundler': persistent("bundler"),
    },
    scalable: {"default": 1},
    http: null,
    envs: {
      // set instances variables
      RUBY_ENV: "development",
      BUNDLE_APP_CONFIG: "/azk/bundler",
    },
  },
  redis: {
    image: {"docker": "redis"},
    export_envs: {
      "REDIS_HOST": "#{net.host}",
      "REDIS_PORT": "#{net.port.data}",
      "REDIS_URL": "redis://#{net.host}:#{net.port[6379]}",
    },
  },
  postgres: {
    // Dependent systems
    depends: [],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/postgres:9.3"},
    shell: "/bin/bash",
    wait: {"retry": 20, "timeout": 1000},
    mounts: {
      '/var/lib/postgresql': persistent("postgresql"),
      '/var/log/postgresql': path("./log/postgresql"),
    },
    ports: {
      // exports global variables
      data: "5432/tcp",
    },
    envs: {
      POSTGRESQL_USER: "azk",
      POSTGRESQL_PASS: "azk",
      POSTGRESQL_DB: "postgres_development",
      POSTGRESQL_HOST: "#{net.host}",
      POSTGRESQL_PORT: "#{net.port.data}",
    },
    export_envs: {
      // check this gist to configure your database
      // https://gist.github.com/gullitmiranda/62082f2e47c364ef9617
      POSTGRES_USERNAME: "azk",
      POSTGRES_PASSWORD: "azk",
      POSTGRES_DATABASE: "feedbin_development",
      POSTGRES_HOST: "#{net.host}",
      POSTGRES_PORT: "#{net.port.data}",
      DATABASE_URL: "postgres://#{envs.POSTGRESQL_USER}:#{envs.POSTGRESQL_PASS}@#{net.host}:#{net.port.data}/${envs.POSTGRESQL_DB}",
    },
  },
  elasticsearch: {
    image: { "docker": "barnybug/elasticsearch:0.90.13" },
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      http: "9200",
    },
    export_envs : {
      ELASTICSEARCH_URL: "#{system.name}.#{azk.default_domain}:#{net.port[9200]}",
    },
  },
  memcached: {
    image: { "docker": "memcached" },
    ports: {
      http: "11211",
    },
    export_envs: {
      MEMCACHED_HOSTS: "#{system.name}.#{azk.default_domain}:#{net.port[11211]}"
    }
  }
});
