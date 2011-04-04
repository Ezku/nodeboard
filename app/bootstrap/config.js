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
        models: root + '/app/shared/models/',
        collections: root + '/app/shared/collections/',
        public: root + '/public/',
        vendor: root + '/vendor/'
      },
      mongo: {
        connection: process.env.DUOSTACK_DB_MONGODB || 'mongodb://localhost/aaltoboard'
      },
      boards: {
        guilds: {
          ak: {
            name: "Arkkitehtikilta"
          },
          as: {
            name: "Automaatio- ja Systeemitekniikka"
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
      },
      shared: 'backbone'
    };
    return config;
  };
}).call(this);
