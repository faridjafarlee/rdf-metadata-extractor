require('dotenv').config();
const Sequelize = require('sequelize');

const {DATABASE_CONNECTION_STRING} = process.env;

class Database {
  #connection = null;
  #models = new Map();
  
  constructor(connectionString) {
    this.#connection = this.createConnection(connectionString);
  }
  
  createConnection(connectionString) {
    return new Sequelize(
      connectionString,
      {
        logging: false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      });
  }
  
  async connect(onConnect, onError) {
    try {
      await this.connection.authenticate();
      if (onConnect) onConnect(this);
    }
    catch(error) {
      if(onError) return onError(error);
      throw error;
    }
  }
  
  async disconnect() {
    return this.connection.close();
  }
  
  get connection() {
    if (!this.#connection) {
      throw new Error('Connection not initiated');
    }
    return this.#connection;
  }
  
  initModels(schemas) {
    const relations = [];
  
    for (const modelName in schemas) {
      const model = this.connection.define(
        modelName,
        schemas[modelName].fields,
        Object.assign({},
          schemas[modelName].options,
          {sequelize: this.connection}
        )
      );
      if (schemas[modelName].removeAttributes.length) {
        schemas[modelName].removeAttributes.forEach(attribute => {
          model.removeAttribute(attribute);
        });
      }
      this.#models.set(modelName, model);
  
      schemas[modelName]
        .relations
        .forEach(relation => relations.push([modelName, relation]));
    }
    
    this.initRelations(relations);
  }
  
  initRelations(relations) {
    for (const [modelName, relation] of relations) {
      switch(relation.type) {
        case 'belongsTo' :
          this.model(modelName).belongsTo(this.model(relation.target), {as: relation.as});
          break;
          
        case 'belongsToManyThrough':
          this.model(modelName).belongsToMany(this.model(relation.target), {through: this.model(relation.through), as: relation.as});
          break;
      }
    }
  }
  
  model(name) {
    return this.#models.get(name);
  }
}

const db = new Database(DATABASE_CONNECTION_STRING);
db.initModels(require('./schemas'));

module.exports = db;