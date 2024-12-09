import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Form extends Model {
  public id!: number;
  public name!: string;
  public fields!: object;
}

Form.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fields: {
      type: DataTypes.JSONB, // Stores fields like input types, labels, etc.
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'forms',
    timestamps: true,
  }
);

export default Form;
