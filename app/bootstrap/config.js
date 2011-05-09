(function() {
  module.exports = function(root) {
    var config;
    config = {
      paths: {
        root: root,
        app: root + '/app/',
        schemas: root + '/app/schemas/',
        services: root + '/app/services/',
        views: root + '/app/views/',
        shared: root + '/app/shared/',
        public: root + '/public/',
        vendor: root + '/vendor/',
        mount: root + '/mnt/',
        temp: root + '/tmp/'
      },
      mongo: {
        connection: process.env.DUOSTACK_DB_MONGODB || 'mongodb://localhost/aaltoboard'
      },
      images: {
        thumbnail: {
          width: 128,
          height: 128
        }
      },
      security: {
        floodwindow: 60
      },
      boards: {
        guilds: {
          ak: {
            name: "Arkkitehtikilta"
          },
          as: {
            name: "Aivan Sama"
          },
          bio: {
            name: "Bioinformaatiotekniikka"
          },
          fk: {
            name: "Fyysikkokilta"
          },
          ik: {
            name: "Insinöörikilta"
          },
          inf: {
            name: "Informaatioverkostot"
          },
          kik: {
            name: "Koneinsinöörikilta"
          },
          kk: {
            name: "Kemistikilta"
          },
          pjk: {
            name: "Puunjalostajakilta"
          },
          tik: {
            name: "Tietokilta"
          },
          vk: {
            name: "Vuorimieskilta"
          }
        }
      }
    };
    return config;
  };
}).call(this);
