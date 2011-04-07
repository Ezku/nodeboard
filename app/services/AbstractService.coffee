unimplemented = (data, success, error) -> error(new Error "Unimplemented service method")

module.exports = class AbstractService
    create: unimplemented
    read: unimplemented
    update: unimplemented
    delete: unimplemented