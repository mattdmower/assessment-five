import { DataTypes, Model } from 'sequelize';
import util from 'util';
import connectToDB from './db.js';

const db = await connectToDB('postgresql:///animals');

export class Human extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }

  getFullName() {
    // TODO: Implement this method
    return `${this.fname} ${this.lname}`;
  }
}

// TODO: Human.init()
Human.init({
  human_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fname: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  lname: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  sequelize: db,
  modelName: 'Human'
});

export class Animal extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
};

// TODO: Animal.init()
Animal.init({
  animal_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  human_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Human,
      key: 'human_id'
    }
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  species: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  birth_year: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize: db,
  modelName: 'Animal'
});

// TODO: Define Relationship
Human.hasMany(Animal, { foreignKey: 'human_id' });
Animal.belongsTo(Human, { foreignKey: 'human_id' });

export default db;